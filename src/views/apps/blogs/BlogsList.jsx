import React, { useContext, useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from 'src/components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from 'src/components/frontend-pages/shared/header/HpHeader';
import Footer from 'src/components/frontend-pages/shared/footer';
import ScrollToTop from 'src/components/frontend-pages/shared/scroll-to-top';
import { BlogProvider, BlogContext } from 'src/context/BlogContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { softDeleteBlog } from 'src/services/blogService';
import { mutate } from 'swr';

function InnerList() {
  const navigate = useNavigate();
  const { posts, isLoading, error } = useContext(BlogContext);
  const rows = useMemo(() => (posts || []).filter((p) => !p.deleted), [posts]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    await softDeleteBlog(id);

    // ✅ تحديث القوائم
    await mutate('/api/data/blog/BlogPosts');
    await mutate('/api/data/blog/BlogPosts?includeDeleted=true');

    navigate('/blogs/deleted', { replace: true });
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBlog(null);
  };

  if (isLoading)
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    );
  if (error) return <Typography color="error">خطأ أثناء التحميل.</Typography>;

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Blogs</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/blogs/create"
            >
              Add New
            </Button>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" sx={{ minWidth: 80 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  onClick={() => handleBlogClick(r)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {r.coverImg && r.coverImg.trim() !== '' ? (
                      <Avatar
                        src={r.coverImg}
                        alt={r.title}
                        sx={{ width: 60, height: 60 }}
                        variant="rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'grey.300',
                        display: r.coverImg && r.coverImg.trim() !== '' ? 'none' : 'block',
                      }}
                      variant="rounded"
                    >
                      <Typography variant="caption" color="text.secondary">
                        No Image
                      </Typography>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {r.title}
                      </Typography>
                      {r.subtitle && (
                        <Typography variant="caption" color="text.secondary">
                          {r.subtitle}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {r.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {(r.tags || []).map((t) => (
                        <Chip key={t} size="small" label={t} />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={r.status === 'published' ? 'Published' : 'Draft'}
                      color={r.status === 'published' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ minWidth: 80 }}>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r.id);
                      }}
                      aria-label="Delete"
                      size="small"
                      title="Delete Blog"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center">لا توجد مقالات.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Blog Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedBlog && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                {selectedBlog.coverImg && selectedBlog.coverImg.trim() !== '' ? (
                  <Avatar
                    src={selectedBlog.coverImg}
                    alt={selectedBlog.title}
                    sx={{ width: 60, height: 60 }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.300' }} variant="rounded">
                    <Typography variant="caption" color="text.secondary">
                      No Image
                    </Typography>
                  </Avatar>
                )}
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedBlog.title}
                  </Typography>
                  {selectedBlog.subtitle && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedBlog.subtitle}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Slug
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBlog.slug}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Category
                  </Typography>
                  <Chip label={selectedBlog.category} size="small" />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedBlog.status === 'published' ? 'Published' : 'Draft'}
                    color={selectedBlog.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {(selectedBlog.tags || []).map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Content
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedBlog.content}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Author
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={selectedBlog.author?.avatar} sx={{ width: 40, height: 40 }} />
                    <Typography variant="body2">{selectedBlog.author?.name || 'Admin'}</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Created At
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Statistics
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={`Views: ${selectedBlog.view || 0}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Shares: ${selectedBlog.share || 0}`}
                      size="small"
                      variant="outlined"
                    />
                    {selectedBlog.featured && (
                      <Chip label="Featured" size="small" color="primary" />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

export default function BlogsList() {
  return (
    <BlogProvider>
      <PageContainer title="Blogs List" description="All blogs">
        <HeaderAlert />
        <HpHeader />
        <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            Blogs
          </Typography>
          <InnerList />
        </Container>
        <Footer />
        <ScrollToTop />
      </PageContainer>
    </BlogProvider>
  );
}


