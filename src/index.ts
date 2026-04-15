interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Dropbox MCP Pack — wraps the Dropbox API v2
 *
 * OAuth: provider = 'dropbox', access token via _context.dropbox.accessToken.
 * Tools: list folder, search, get metadata, download, create folder.
 * Note: Most Dropbox API calls are POST with JSON body, even for reads.
 */


const API = 'https://api.dropboxapi.com/2';
const CONTENT_API = 'https://content.dropboxapi.com/2';

interface DropboxContext {
  dropbox?: { accessToken: string };
}

async function dbxPost(ctx: DropboxContext, path: string, body: unknown): Promise<unknown> {
  if (!ctx.dropbox) {
    return { error: 'connection_required', message: 'Connect your Dropbox account at https://pipeworx.io/account' };
  }
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ctx.dropbox.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dropbox API error (${res.status}): ${text}`);
  }
  return res.json();
}

async function dbxDownload(ctx: DropboxContext, filePath: string): Promise<unknown> {
  if (!ctx.dropbox) {
    return { error: 'connection_required', message: 'Connect your Dropbox account at https://pipeworx.io/account' };
  }
  const apiArg = JSON.stringify({ path: filePath });
  const res = await fetch(`${CONTENT_API}/files/download`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ctx.dropbox.accessToken}`,
      'Dropbox-API-Arg': apiArg,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dropbox API error (${res.status}): ${text}`);
  }
  const metadata = res.headers.get('dropbox-api-result');
  const content = await res.text();
  return {
    metadata: metadata ? JSON.parse(metadata) : null,
    content,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'dropbox_list_folder',
    description: 'List files and folders in a Dropbox directory.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Folder path (e.g., "" for root, "/Documents")' },
        limit: { type: 'number', description: 'Max entries to return (default 100)' },
      },
      required: ['path'],
    },
  },
  {
    name: 'dropbox_search',
    description: 'Search for files and folders in Dropbox by name or content.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query string' },
        max_results: { type: 'number', description: 'Maximum results to return (default 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'dropbox_get_metadata',
    description: 'Get metadata for a file or folder in Dropbox.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'File or folder path' },
      },
      required: ['path'],
    },
  },
  {
    name: 'dropbox_download',
    description: 'Download a file from Dropbox. Returns the file content as text and its metadata.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'File path to download' },
      },
      required: ['path'],
    },
  },
  {
    name: 'dropbox_create_folder',
    description: 'Create a new folder in Dropbox.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Path of the folder to create (e.g., "/New Folder")' },
        autorename: { type: 'boolean', description: 'Auto-rename if a folder with the same name exists (default false)' },
      },
      required: ['path'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as DropboxContext;
  delete args._context;

  switch (name) {
    case 'dropbox_list_folder': {
      return dbxPost(context, '/files/list_folder', {
        path: args.path as string,
        limit: (args.limit as number) ?? 100,
      });
    }

    case 'dropbox_search': {
      return dbxPost(context, '/files/search_v2', {
        query: args.query as string,
        options: {
          max_results: (args.max_results as number) ?? 20,
        },
      });
    }

    case 'dropbox_get_metadata': {
      return dbxPost(context, '/files/get_metadata', {
        path: args.path as string,
        include_media_info: true,
      });
    }

    case 'dropbox_download': {
      return dbxDownload(context, args.path as string);
    }

    case 'dropbox_create_folder': {
      return dbxPost(context, '/files/create_folder_v2', {
        path: args.path as string,
        autorename: (args.autorename as boolean) ?? false,
      });
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'dropbox' } satisfies McpToolExport;
