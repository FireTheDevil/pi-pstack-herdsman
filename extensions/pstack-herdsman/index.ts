import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { definitionPath, renderDefinition, saveDefinition, installGlobalDefinitions, ROLES } from '../../scripts/setup.mjs';
import { stripSkillsByLocationPrefix } from './skill-strip.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const POTETO_HINT = "New task? Playbook match or rigor needed -> apply /skill:poteto-mode. Casual turn or user opts out -> don't.";
// Herdsman documents this tag as extension interoperability metadata, not a security boundary.
export function isManagedAgent(prompt: string): boolean { return /(?:^|\n)\s*<active_agent name="[^"\n]+"\s*\/>\s*(?:\n|$)/.test(prompt); }
function decision(ctx: ExtensionContext, type: string): boolean | undefined {
  let value: boolean | undefined;
  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type !== 'custom' || entry.customType !== type) continue;
    const data: unknown = entry.data;
    if (data && typeof data === 'object' && 'enabled' in data && typeof data.enabled === 'boolean') value = data.enabled;
  }
  return value;
}
export default function pstackHerdsman(pi: ExtensionAPI): void {
  let enabled = false;
  let catalog = true;
  const leaf = (ctx: ExtensionContext) => isManagedAgent(ctx.getSystemPrompt());
  const status = (ctx: ExtensionContext) => {
    if (ctx.mode === 'tui') ctx.ui.setStatus('pstack-mode', enabled && !leaf(ctx) ? 'pstack: poteto mode' : undefined);
  };
  const persist = (value: boolean, ctx: ExtensionContext) => { enabled = value; pi.appendEntry('pstack-mode', { enabled: value }); status(ctx); };
  const restore = (ctx: ExtensionContext) => {
    const prior = decision(ctx, 'pstack-mode');
    enabled = !leaf(ctx) && prior === true;
    catalog = decision(ctx, 'pstack-herdsman-catalog') ?? true;
    status(ctx);
  };
  pi.on('session_start', async (_, ctx) => {
    restore(ctx);
    if (leaf(ctx)) return;
    try {
      const created = installGlobalDefinitions(ROOT);
      if (created.length) ctx.ui.notify('Copied ' + created.length + ' missing pstack profiles globally. Restart Pi to make them available to Herdsman. Existing profiles were preserved.', 'info');
    } catch (error) { ctx.ui.notify('Could not install global pstack profiles: ' + (error instanceof Error ? error.message : String(error)), 'error'); }
  });
  pi.on('session_tree', async (_, ctx) => restore(ctx));
  pi.on('input', async (event, ctx) => {
    if (!leaf(ctx) && /^\/skill:poteto-mode(?:\s|$)/.test(event.text)) persist(true, ctx);
    return { action: 'continue' };
  });
  pi.on('before_agent_start', async (event, ctx) => {
    const base = catalog ? event.systemPrompt : stripSkillsByLocationPrefix(event.systemPrompt, join(ROOT, 'skills')).prompt;
    return { systemPrompt: enabled && !leaf(ctx) ? base + '\n\n' + POTETO_HINT : base };
  });
  pi.registerCommand('poteto-mode', {
    description: 'Enable sticky Poteto Mode, or disable it with /poteto-mode off.',
    handler: async (args, ctx) => {
      if (leaf(ctx)) { ctx.ui.notify('Managed agent: complete the bounded assignment without controller mode.', 'info'); return; }
      const raw = args.trim();
      if (/^(off|disable|stop)(?:\s|$)/i.test(raw)) { persist(false, ctx); ctx.ui.notify('Poteto Mode off.', 'info'); return; }
      persist(true, ctx);
      pi.sendUserMessage('/skill:poteto-mode' + (raw ? ' ' + raw : ''), ctx.isIdle() ? { expandPromptTemplates: true } : { expandPromptTemplates: true, deliverAs: 'followUp' });
    }
  });
  pi.registerCommand('pstack', {
    description: 'Show or toggle the session pstack skill catalog filter: on, off, status.',
    handler: async (args, ctx) => {
      const token = args.trim().toLowerCase();
      if (token === 'on' || token === 'off') { catalog = token === 'on'; pi.appendEntry('pstack-herdsman-catalog', { enabled: catalog }); }
      else if (token && token !== 'status') { ctx.ui.notify('Usage: /pstack [on|off|status]', 'error'); return; }
      ctx.ui.notify('pstack-herdsman catalog filter ' + (catalog ? 'on' : 'off') + '; Poteto Mode ' + (enabled ? 'on' : 'off') + '. Bundled skills remain hidden by frontmatter. Direct /skill:<name> still works. Backend readiness is not tested by this status command.', 'info');
    }
  });
  pi.registerCommand('setup-pstack', {
    description: 'Preview and create a project pstack agent definition. Existing definitions are never overwritten.',
    handler: async (args, ctx) => {
      if (leaf(ctx)) { ctx.ui.notify('Setup belongs in the lead session.', 'error'); return; }
      if (!ctx.hasUI) { ctx.ui.notify('No writes in headless mode. Review definitions/ and manually copy selected templates into trusted project .pi/agents; model/thinking otherwise inherit. Global definitions override project definitions. Restart/reload and inspect agent list.', 'info'); return; }
      try {
        const tokens = args.trim().split(/\s+/).filter(Boolean);
        if (tokens.length > 1 || tokens[0]?.startsWith('--')) throw new Error('Usage: /setup-pstack [role] (project only)');
        const role = tokens[0] || await ctx.ui.select('Role to create in trusted project .pi/agents', ROLES);
        if (!role) return;
        const path = definitionPath(ctx.cwd, role);
        const content = renderDefinition(ROOT, role);
        const model = JSON.parse(content.match(/^model: (.+)$/m)![1]);
        if (!ctx.modelRegistry.getAvailable().some(available => available.provider + '/' + available.id === model))
          throw new Error('Configured model unavailable: ' + model + '. No definition created.');
        if (!await ctx.ui.confirm('Create project definition?', path + '\n\n' + content + '\nGlobal same-name definitions override this file. Existing files are never overwritten. Trust this project only after reviewing its contents.')) return;
        saveDefinition(ctx.cwd, role, content);
        ctx.ui.notify('Created ' + path + '. Repeat for other roles. Restart/reload Pi and inspect agent list for effective definitions. No settings or running agents changed.', 'info');
      } catch (error) { ctx.ui.notify(error instanceof Error ? error.message : String(error), 'error'); }
    }
  });
}
