'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

export default function QuillEditor({ value = '', onChange }) {
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
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'link', 'image', 'video',
    'blockquote', 'code-block', 'align'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-300 shadow-sm">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your post..."
        className="min-h-[400px]"
      />
    </div>
  );
}