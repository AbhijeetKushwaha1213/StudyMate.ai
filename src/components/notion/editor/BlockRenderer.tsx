import React, { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import type { Block } from '@/types/notion';
import { richTextToHTML, htmlToRichText } from './serialization';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface BlockRendererProps {
  block: Block;
  editable: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onSlashCommand?: (position: { x: number; y: number }) => void;
}

export function BlockRenderer({ block, editable, onUpdate, onSlashCommand }: BlockRendererProps) {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render text-based blocks with TipTap editor
  if (
    block.type === 'text' ||
    block.type === 'heading1' ||
    block.type === 'heading2' ||
    block.type === 'heading3' ||
    block.type === 'quote'
  ) {
    return (
      <TextBlockRenderer
        block={block}
        editable={editable}
        onUpdate={onUpdate}
        onSlashCommand={onSlashCommand}
      />
    );
  }

  // Render list blocks
  if (block.type === 'bulletList' || block.type === 'numberedList') {
    return <ListBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render checkbox block
  if (block.type === 'checkbox') {
    return <CheckboxBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render callout block
  if (block.type === 'callout') {
    return <CalloutBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render code block
  if (block.type === 'code') {
    return <CodeBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render image block
  if (block.type === 'image') {
    return <ImageBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render file block
  if (block.type === 'file') {
    return <FileBlockRenderer block={block} />;
  }

  // Render embed block
  if (block.type === 'embed') {
    return <EmbedBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  // Render divider
  if (block.type === 'divider') {
    return <div className="my-4 border-t border-border" />;
  }

  // Render table of contents
  if (block.type === 'toc') {
    return (
      <div className="my-4 p-4 bg-muted rounded-md">
        <div className="font-semibold mb-2">Table of Contents</div>
        <div className="text-sm text-muted-foreground">TOC will be generated from headings</div>
      </div>
    );
  }

  // Render table block
  if (block.type === 'table') {
    return <TableBlockRenderer block={block} editable={editable} onUpdate={onUpdate} />;
  }

  return null;
}

// Text-based block renderer with TipTap
function TextBlockRenderer({ block, editable, onUpdate, onSlashCommand }: BlockRendererProps) {
  const content = 'content' in block ? block.content : { text: '', marks: [] };
  const initialHTML = richTextToHTML(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We handle headings separately
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      Link,
      Underline,
      TextStyle,
      Color,
    ],
    content: initialHTML,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const richText = htmlToRichText(html);
      onUpdate({ content: richText } as Partial<Block>);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/' && onSlashCommand) {
          const { selection } = view.state;
          const coords = view.coordsAtPos(selection.from);
          onSlashCommand({ x: coords.left, y: coords.bottom });
          return true;
        }
        return false;
      },
      attributes: {
        class: 'outline-none focus:outline-none min-h-[2rem] cursor-text',
      },
    },
  });

  const getClassName = () => {
    const base = 'block-content px-3 py-2 min-h-[2rem] cursor-text';
    switch (block.type) {
      case 'heading1':
        return `${base} text-3xl font-bold`;
      case 'heading2':
        return `${base} text-2xl font-bold`;
      case 'heading3':
        return `${base} text-xl font-bold`;
      case 'quote':
        return `${base} border-l-4 border-primary pl-4 italic`;
      default:
        return base;
    }
  };

  // Auto-focus on mount if it's a new empty block
  React.useEffect(() => {
    if (editor && editable && content.text === '') {
      editor.commands.focus();
    }
  }, []);

  return (
    <div 
      className={getClassName()}
      onClick={() => {
        if (editor && editable) {
          editor.commands.focus();
        }
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

// List block renderer
function ListBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'bulletList' && block.type !== 'numberedList') return null;

  const ListTag = block.type === 'bulletList' ? 'ul' : 'ol';
  const listClass = block.type === 'bulletList' ? 'list-disc' : 'list-decimal';
  const items = block.items || [];

  const handleItemChange = (index: number, newText: string) => {
    const newItems = [...items];
    newItems[index] = { text: newText, marks: [] };
    onUpdate({ items: newItems } as Partial<Block>);
  };

  const handleAddItem = () => {
    const newItems = [...items, { text: '', marks: [] }];
    onUpdate({ items: newItems } as Partial<Block>);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length === 1) return; // Keep at least one item
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ items: newItems } as Partial<Block>);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Add new item after current
      const newItems = [
        ...items.slice(0, index + 1),
        { text: '', marks: [] },
        ...items.slice(index + 1)
      ];
      onUpdate({ items: newItems } as Partial<Block>);
      // Focus next item after a short delay
      setTimeout(() => {
        const nextInput = e.currentTarget.parentElement?.nextElementSibling?.querySelector('input');
        nextInput?.focus();
      }, 10);
    } else if (e.key === 'Backspace' && items[index].text === '' && items.length > 1) {
      e.preventDefault();
      handleDeleteItem(index);
      // Focus previous item
      if (index > 0) {
        setTimeout(() => {
          const prevInput = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
          prevInput?.focus();
        }, 10);
      }
    }
  };

  return (
    <div className="block-content px-3 py-2">
      <ListTag className={`${listClass} list-inside space-y-1`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 group/item">
            {editable ? (
              <>
                <input
                  type="text"
                  value={typeof item === 'string' ? item : item.text}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="flex-1 bg-transparent outline-none focus:bg-accent/20 px-1 py-0.5 rounded transition-colors"
                  placeholder="List item..."
                />
                {items.length > 1 && (
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                    aria-label="Delete item"
                    title="Delete item"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                )}
              </>
            ) : (
              <span>{typeof item === 'string' ? item : item.text}</span>
            )}
          </li>
        ))}
      </ListTag>
      {editable && (
        <button
          onClick={handleAddItem}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <span>+ Add item</span>
        </button>
      )}
    </div>
  );
}

// Checkbox block renderer
function CheckboxBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'checkbox') return null;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ 
      content: { text: e.target.value, marks: [] } 
    } as Partial<Block>);
  };

  return (
    <div className="block-content px-3 py-2 flex items-start gap-2">
      <Checkbox
        checked={block.checked}
        onCheckedChange={(checked) => {
          console.log('Checkbox changed:', checked);
          onUpdate({ checked: checked as boolean });
        }}
        disabled={!editable}
        className="mt-1"
      />
      {editable ? (
        <input
          type="text"
          value={block.content.text}
          onChange={handleTextChange}
          className={`flex-1 bg-transparent outline-none focus:bg-accent/20 px-1 py-0.5 rounded transition-colors ${
            block.checked ? 'line-through text-muted-foreground' : ''
          }`}
          placeholder="To-do item..."
        />
      ) : (
        <span className={block.checked ? 'line-through text-muted-foreground' : ''}>
          {block.content.text}
        </span>
      )}
    </div>
  );
}

// Callout block renderer
function CalloutBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'callout') return null;

  return (
    <div
      className="block-content px-3 py-2 rounded-md flex items-start gap-2"
      style={{ backgroundColor: block.backgroundColor || '#f0f0f0' }}
    >
      <span className="text-xl">{block.icon || '💡'}</span>
      <span>{block.content.text}</span>
    </div>
  );
}

// Code block renderer
function CodeBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'code') return null;

  return (
    <div className="block-content my-2">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code className={`language-${block.language || 'text'}`}>{block.content}</code>
      </pre>
    </div>
  );
}

// Image block renderer
function ImageBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'image') return null;

  return (
    <div className="block-content my-2">
      <img
        src={block.url}
        alt={block.caption}
        className="max-w-full h-auto rounded-md"
        style={{ width: block.width, height: block.height }}
      />
      {block.caption && (
        <div className="text-sm text-muted-foreground text-center mt-2">{block.caption}</div>
      )}
    </div>
  );
}

// File block renderer
function FileBlockRenderer({ block }: { block: Block }) {
  if (block.type !== 'file') return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="block-content px-3 py-2 border border-border rounded-md flex items-center gap-2">
      <div className="flex-1">
        <div className="font-medium">{block.filename}</div>
        <div className="text-sm text-muted-foreground">{formatFileSize(block.file_size)}</div>
      </div>
      <button className="text-primary hover:underline">Download</button>
    </div>
  );
}

// Embed block renderer
function EmbedBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'embed') return null;

  return (
    <div className="block-content my-2">
      <div className="aspect-video rounded-md overflow-hidden bg-muted">
        <iframe
          src={block.url}
          className="w-full h-full"
          allowFullScreen
          title={block.caption || 'Embedded content'}
        />
      </div>
      {block.caption && (
        <div className="text-sm text-muted-foreground text-center mt-2">{block.caption}</div>
      )}
    </div>
  );
}

// Table block renderer
function TableBlockRenderer({ block, editable, onUpdate }: Omit<BlockRendererProps, 'onSlashCommand'>) {
  if (block.type !== 'table') return null;

  return (
    <div className="block-content my-2 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {block.columns.map((column) => (
              <th
                key={column.id}
                className="border border-border p-2 bg-muted font-semibold text-left"
                style={{ width: column.width }}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.id}>
              {block.columns.map((column) => (
                <td key={column.id} className="border border-border p-2">
                  {row.cells[column.id] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
