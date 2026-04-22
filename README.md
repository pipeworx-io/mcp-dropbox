# mcp-dropbox

Dropbox MCP Pack — wraps the Dropbox API v2

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `dropbox_list_folder` | List files and folders in a Dropbox directory. Returns names, types, sizes, and modification dates. Use when browsing folder contents or checking what\'s stored at a path. |
| `dropbox_search` | Search Dropbox for files and folders by name or content. Returns matching paths, file types, and metadata. Use when you need to find a file without knowing its exact location. |
| `dropbox_get_metadata` | Get detailed metadata for a file or folder: size, modified date, ID, sharing status, and revision info. Use before downloading or modifying to inspect properties. |
| `dropbox_download` | Download a file from Dropbox and return its content as text plus metadata (size, type, modified date). Use to retrieve file contents for processing or inspection. |
| `dropbox_create_folder` | Create a new folder in Dropbox at a specified path. Returns folder metadata. Use to organize files or set up directory structures. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "dropbox": {
      "url": "https://gateway.pipeworx.io/dropbox/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Dropbox data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
