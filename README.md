# mcp-dropbox

Dropbox MCP Pack — wraps the Dropbox API v2

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `dropbox_list_folder` | List files and folders in a Dropbox directory. |
| `dropbox_search` | Search for files and folders in Dropbox by name or content. |
| `dropbox_get_metadata` | Get metadata for a file or folder in Dropbox. |
| `dropbox_download` | Download a file from Dropbox. Returns the file content as text and its metadata. |
| `dropbox_create_folder` | Create a new folder in Dropbox. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "dropbox": {
      "url": "https://gateway.pipeworx.io/dropbox/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use dropbox
```

## License

MIT
