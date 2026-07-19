"use client";

import { useState, useRef } from "react";
import { Bold, Italic, Heading2, Link as LinkIcon, Image as ImageIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleEditor({ value, onChange, placeholder }: SimpleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (tagStart: string, tagEnd: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + tagStart + selectedText + tagEnd + value.substring(end);
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 0);
  };

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
      <div className="bg-slate-50 border-b p-2 flex flex-wrap gap-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => insertTag('<b>', '</b>')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => insertTag('<i>', '</i>')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => insertTag('<h2>', '</h2>')}
          title="Título H2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => {
            const url = prompt("Digite a URL do link:");
            if (url) insertTag(`<a href="${url}" class="text-primary-600 hover:underline">`, '</a>');
          }}
          title="Inserir Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => {
            const url = prompt("Digite a URL da imagem:");
            if (url) insertTag(`<img src="${url}" alt="Imagem do artigo" class="rounded-lg my-4 max-w-full h-auto" />`, '');
          }}
          title="Inserir Imagem"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => insertTag('<ul class="list-disc pl-6 space-y-2 my-4">\n  <li>', '</li>\n</ul>')}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] border-0 focus-visible:ring-0 rounded-none resize-y"
      />
      <div className="bg-slate-50 border-t p-2 text-xs text-slate-500 flex justify-between">
        <span>Você pode usar HTML diretamente (ex: &lt;p&gt;Texto&lt;/p&gt;)</span>
        <span>{value.length} caracteres</span>
      </div>
    </div>
  );
}
