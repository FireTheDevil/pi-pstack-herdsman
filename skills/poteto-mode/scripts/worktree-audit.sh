#!/usr/bin/env bash
# Read-only worktree prune audit. Classifies every git worktree by size, merge
# state, uncommitted work, remote/PR state, and the most recent chat that
# operated in it. Emits a table sorted by size with a suggested bucket. Never
# deletes anything; deletion stays a human-gated step in the playbook.
#
# Usage: worktree-audit.sh [-b|--base <ref>] [repo-path]
#   repo-path defaults to the current repo.
#   -b sets the ref the MERGED column checks against (e.g. origin/integration).
#   Without it the base is origin/HEAD, then origin/main, then origin/master.
#   origin/HEAD is the remote's default branch, not necessarily the branch PRs
#   merge into; pass -b when they differ.
set -u

base=""
while [ $# -gt 0 ]; do
	case "$1" in
	-b|--base) [ $# -ge 2 ] || { echo "error: $1 needs a ref" >&2; exit 2; }; base="$2"; shift 2 ;;
	-h|--help) sed -n '2,/^set -u/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
	-*) echo "error: unknown option: $1" >&2; exit 2 ;;
	*) break ;;
	esac
done

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "not in a git repo; pass a repo path" >&2; exit 1; }
cd "$repo" || exit 1
git rev-parse --git-dir >/dev/null 2>&1 || { echo "error: not a git repo: $repo" >&2; exit 1; }

# Main worktree is the first entry; everything else is a candidate.
main_wt=$(git worktree list --porcelain | sed -n 's/^worktree //p' | head -1)

if [ -z "$base" ]; then
	for cand in "$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)" origin/main origin/master; do
		[ -n "$cand" ] && git rev-parse --verify --quiet "$cand^{commit}" >/dev/null && { base="$cand"; break; }
	done
	[ -z "$base" ] && { echo "error: no base ref (origin/HEAD, origin/main, origin/master all missing); pass -b <ref>" >&2; exit 1; }
	echo "warn: no -b given; MERGED checks against $base" >&2
fi

# The fetch is best-effort (stale is fine for
# a first pass) and runs before the check, since -b may name a branch not
# fetched yet. The explicit refspec creates it even in a single-branch clone.
case "$base" in
origin/*) git fetch origin "+refs/heads/${base#origin/}:refs/remotes/$base" --quiet 2>/dev/null \
	|| echo "warn: could not fetch $base; merged column may be stale" >&2 ;;
esac
git rev-parse --verify --quiet "$base^{commit}" >/dev/null 2>&1 || { echo "error: base ref not found: $base" >&2; exit 1; }

# GNU stat/date use different flags from BSD; select once without fallback
# output from an incompatible invocation contaminating transcript evidence.
if stat -c %Y / >/dev/null 2>&1; then
	stat_fmt=(-c '%Y %n'); fmt_day() { date -d "@$1" '+%Y-%m-%d'; }
else
	stat_fmt=(-f '%m %N'); fmt_day() { date -r "$1" '+%Y-%m-%d'; }
fi

# Origin's upstream list fields lack a verified completeness/repository-identity
# contract. Try its read-only lookup first, but never use that as cleanup proof.
# Until that contract is documented, fall back to gh's bounded, explicit read.
prs=$(mktemp) || exit 1
trap 'rm -f "$prs"' EXIT
if command -v origin >/dev/null 2>&1; then
	origin pr list --state all --json number,status,headRef >/dev/null 2>&1 || :
	echo "warn: Origin PR evidence cannot certify completeness/identity; trying gh" >&2
fi
# Match the documented [HOST/]OWNER/REPO selector against exactly one origin
# URL. Never let GH_REPO, GH_HOST, or gh's default-repo configuration choose it.
github_repository() {
	local remote host owner name label
	local https_ssh='^(https://|ssh://git@)([A-Za-z0-9.-]+)/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)$'
	local scp='^git@([A-Za-z0-9.-]+):([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)$'
	# Sentinel preserves trailing empty URL rows for ambiguity rejection.
	remote=$(git remote get-url --all origin 2>/dev/null && printf '|') || return 1
	remote=${remote%|}
	remote=${remote%$'\n'}
	if [[ "$remote" =~ $https_ssh ]]; then
		host=${BASH_REMATCH[2]}; owner=${BASH_REMATCH[3]}; name=${BASH_REMATCH[4]}
	elif [[ "$remote" =~ $scp ]]; then
		host=${BASH_REMATCH[1]}; owner=${BASH_REMATCH[2]}; name=${BASH_REMATCH[3]}
	else return 1; fi
	name=${name%.git}
	case "$owner" in ""|.|..) return 1 ;; esac
	case "$name" in ""|.|..) return 1 ;; esac
	# No empty labels or leading/trailing hyphens; no ports or URL suffixes.
	case "$host" in .*|*.|*..*) return 1 ;; esac
	for label in ${host//./ }; do
		[[ "$label" =~ ^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?$ ]] || return 1
	done
	printf '%s/%s/%s\n' "$host" "$owner" "$name"
}
forge_known=no
gh_repository=$(github_repository) || gh_repository=""
if [ -n "$gh_repository" ] \
	&& (unset GH_REPO GH_HOST; gh pr list --repo "$gh_repository" --state all --limit 1000 \
	--json number,state,headRefName,isCrossRepository) > "$prs" 2>/dev/null \
	&& jq -e 'type == "array" and length < 1000 and
		all(.[]; type == "object" and
			(.number | type == "number" and . > 0 and floor == .) and
			(.headRefName | type == "string" and length > 0) and
			(.state == "OPEN" or .state == "DRAFT" or .state == "MERGED" or .state == "CLOSED") and
			.isCrossRepository == false) and
		([.[].number] | length == (unique | length)) and
		([.[].headRefName] | length == (unique | length))' "$prs" >/dev/null 2>&1; then
	forge_known=yes
else
	echo "warn: unresolved origin repository or missing, malformed, ambiguous or possibly truncated PR evidence; holding candidates" >&2
	printf '[]\n' > "$prs"
fi

# Match Pi session-manager cwd encoding without scanning other workspaces.
slug=$(printf '%s' "$main_wt" | sed 's#^[/\\]##; s#[/\\:]#-#g')
transcripts="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/sessions/--$slug--"
now=$(date +%s)

echo "# base: $base"
printf "SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n"

git worktree list --porcelain | sed -n 's/^worktree //p' | while IFS= read -r wt; do
	[ "$wt" = "$main_wt" ] && continue

	size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
	head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
	head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
	age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo "?")

	# Squash-merged branches are not ancestors of the base, so PR state is the
	# real signal; merge-base only catches fast-forward/rebase merges.
	git merge-base --is-ancestor "$head" "$base" 2>/dev/null && merged=YES || merged=no

	# Distinguish real WIP (tracked edits) from disposable untracked scratch.
	status_known=yes
	porcelain=$(git -C "$wt" status --porcelain 2>/dev/null) || status_known=no
	if [ "$status_known" = no ]; then dirty=unknown
	elif [ -z "$porcelain" ]; then dirty=clean
	elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
		dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
	else dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"; fi

	branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
	if [ -z "$branch" ]; then remote=detached
	elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
		[ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ] \
			&& remote=pushed \
			|| remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
	else remote=no-remote; fi

	pr=$([ -n "$branch" ] && jq -r --arg b "$branch" \
		'.[] | select(.headRefName==$b) | "#\(.number)/\(.state | ascii_downcase)"' "$prs" 2>/dev/null | head -1)
	[ -z "$pr" ] && pr="-"

	# Most recent chat whose transcript operated in this worktree. Match path
	# followed by "/" or a quote so glint-482 does not match glint-482-r37.
	last="-"; last_ts=0
	candidate_slug=$(printf '%s' "$wt" | sed 's#^[/\\]##; s#[/\\:]#-#g')
	candidate_transcripts="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/sessions/--$candidate_slug--"
	if [ -d "$transcripts" ] || [ -d "$candidate_transcripts" ]; then
		f=$( { rg -l -F -e "${wt}/" -e "${wt}\"" "$transcripts" 2>/dev/null
			# Exact cwd directory is itself evidence, even without a path in messages.
			find "$candidate_transcripts" -type f -name '*.jsonl' 2>/dev/null
		} \
			| while IFS= read -r file; do
				stat "${stat_fmt[@]}" "$file" 2>/dev/null
			done | sort -rn | head -1)
		if [ -n "$f" ]; then last_ts=$(echo "$f" | awk '{print $1}')
			last=$(fmt_day "$last_ts" 2>/dev/null); fi
	fi
	recent=$([ "$last_ts" -gt 0 ] 2>/dev/null && [ $(( (now - last_ts) / 86400 )) -le 4 ] && echo yes || echo no)

	case "$dirty" in unknown) bucket=hold-unknown-state ;; wip:*) bucket=hold-wip ;; *)
		if [ "$forge_known" != yes ]; then bucket=hold-unknown-pr
		else case "$pr" in */open|*/draft) bucket=hold-open-pr ;; *)
			if [ "$recent" = yes ]; then bucket=verify-recent-chat
			elif [ "$merged" = YES ] || [[ "$pr" == */merged ]]; then bucket=safe
			else bucket=review; fi ;;
		esac; fi ;;
	esac

	printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
		"$size" "$age" "$merged" "$dirty" "$remote" "$pr" "$last" "$bucket" "$wt"
done | sort -t$'\t' -k1,1 -rh
