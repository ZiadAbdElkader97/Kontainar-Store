import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import HeaderAlert from 'src/components/frontend-pages/shared/header/HeaderAlert.jsx';
import HpHeader from 'src/components/frontend-pages/shared/header/HpHeader.jsx';
import Footer from 'src/components/landingpage/footer/Footer.jsx';
import ScrollToTop from 'src/components/shared/ScrollToTop.js';
import { BlogProvider } from 'src/context/BlogContext/index';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Slide,
} from '@mui/material';
import { createBlog } from 'src/services/blogService';
import { mutate } from 'swr';

const toSlug = (s) =>
  s
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');

function SlideDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function BlogsCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    cover: '',
    content: '',
    tagsInput: '',
    tags: [],
    isPublished: true,
    category: 'General',
    featured: false,
    seoTitle: '',
    seoDescription: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const autoSlug = useMemo(() => (form.title ? toSlug(form.title) : ''), [form.title]);
  const setVal = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const addTag = () => {
    const t = form.tagsInput.trim();
    if (!t) return;
    if (!form.tags.includes(t)) setForm((p) => ({ ...p, tags: [...p.tags, t], tagsInput: '' }));
    else setForm((p) => ({ ...p, tagsInput: '' }));
  };
  const removeTag = (t) => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !(form.slug || autoSlug) || !form.content) {
      setError(
        "Please enter the title and content. The slug will be generated automatically if you don't enter it.",
      );
      return;
    }
    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      slug: form.slug || autoSlug,
      cover: form.cover || undefined,
      tags: form.tags,
      content: form.content,
      category: form.category,
      status: form.isPublished ? 'published' : 'draft',
      featured: !!form.featured,
      seo: {
        title: form.seoTitle || form.title,
        description: form.seoDescription || form.subtitle || '',
      },
    };
    try {
      setSaving(true);
      await createBlog(payload);
      // ✅ تحديث القوائم
      await mutate('/api/data/blog/BlogPosts'); // حدث SWR
      await mutate('/api/data/blog/BlogPosts?includeDeleted=true');
      navigate('/blogs/list', { replace: true });
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlogProvider>
      <PageContainer title="Add New Blog" description="Create new blog post">
        <HeaderAlert />
        <HpHeader />
        <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
          <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
            <Grid size={12}>
              <Typography variant="h4" fontWeight={700}>
                Add New Blog
              </Typography>
            </Grid>

            <Snackbar
              open={Boolean(error)}
              onClose={() => setError('')}
              TransitionComponent={SlideDown}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              autoHideDuration={6000}
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
            >
              <Alert
                onClose={() => setError('')}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
              >
                {error}
              </Alert>
            </Snackbar>

            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardHeader title="Content" />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Title *"
                      value={form.title}
                      onChange={setVal('title')}
                      fullWidth
                    />
                    <TextField
                      label={`Slug ${autoSlug ? `(auto: ${autoSlug})` : ''}`}
                      value={form.slug}
                      onChange={setVal('slug')}
                      fullWidth
                    />
                    <TextField
                      label="Subtitle"
                      value={form.subtitle}
                      onChange={setVal('subtitle')}
                      fullWidth
                    />
                    <TextField
                      label="Cover Image URL"
                      value={form.cover}
                      onChange={setVal('cover')}
                      fullWidth
                    />
                    {form.cover ? (
                      <Box
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <img
                          src={form.cover}
                          alt="cover"
                          style={{ width: '100%', display: 'block' }}
                        />
                      </Box>
                    ) : null}
                    <TextField
                      label="Content *"
                      value={form.content}
                      onChange={setVal('content')}
                      multiline
                      minRows={10}
                      fullWidth
                    />
                    <Divider />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        label="Add tag"
                        value={form.tagsInput}
                        onChange={setVal('tagsInput')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        size="small"
                      />
                      <Button variant="outlined" onClick={addTag}>
                        Add
                      </Button>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        {form.tags.map((t) => (
                          <Chip key={t} label={t} onDelete={() => removeTag(t)} />
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Publish" />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isPublished}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, isPublished: e.target.checked }))
                          }
                        />
                      }
                      label={form.isPublished ? 'Published' : 'Draft'}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        disabled={saving}
                        onClick={() => setForm((p) => ({ ...p, isPublished: false }))}
                      >
                        Save as Draft
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title="SEO" />
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField
                        label="SEO Title"
                        value={form.seoTitle}
                        onChange={setVal('seoTitle')}
                      />
                      <TextField
                        label="SEO Description"
                        value={form.seoDescription}
                        onChange={setVal('seoDescription')}
                        multiline
                        minRows={3}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
        <Footer />
        <ScrollToTop />
      </PageContainer>
    </BlogProvider>
  );
}


