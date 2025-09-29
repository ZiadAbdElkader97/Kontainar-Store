export async function createBlog(payload) {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create blog');
  return res.json();
}

export async function softDeleteBlog(id) {
  const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete blog');
  return res.json();
}

export async function restoreBlog(id) {
  const res = await fetch(`/api/blogs/${id}/restore`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to restore blog');
  return res.json();
}

export async function permanentDeleteBlog(id) {
  const res = await fetch(`/api/blogs/${id}/permanent`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to permanently delete blog');
  return res.json();
}
