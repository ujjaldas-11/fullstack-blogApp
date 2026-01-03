'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function QuillEditor({ value = '', onChange }) {
  const supabase = createSupabaseBrowserClient();
  const quillRef = React.useRef();

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`; 

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message);
        console.error(uploadError);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      // Insert image into editor
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true) || { index: 0 };
        quill.insertEmbed(range.index, 'image', publicUrl);
        quill.setSelection(range.index + 1);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        [{ align: [] }],
        ['clean'],
      ],
      handlers: {
        image: imageHandler, 
      },
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link', 'image',
    'blockquote', 'code-block',
    'align',
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your amazing post..."
        className="min-h-[400px]"
      />
    </div>
  );
}