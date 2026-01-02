'use client';
import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { FileSpreadsheet } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});



export default function QuillEditor({ value = '', onChange }) {

  const supabase = createSupabaseBrowserClient();

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onChange = async () => {
      const file = input.files[0];
      if (!file) return;

      //generate file name
      const fileExt = file.name.split('.').pop();
      const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      //upload image on supabase

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(FileSpreadsheet, file);

      if (error) {
        alert('Image upload failed: ' + error.message);
        return;
      }

      //public url
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      // Insert image in to editor
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.insertEmbed(Range.index, 'image', publicUrl);
        quill.setSelection(Range.index + 1);
      }

    };
  };

  const quillRef = React.useRef();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['clean'],
    ],
    handler: {
      image: imageHandler,
    }

  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'link', 'image', 'video',
    'blockquote', 'code-block', 'align'
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
        placeholder="Start writing your post..."
        className="min-h-[300px]"
      />
    </div>
  );
}