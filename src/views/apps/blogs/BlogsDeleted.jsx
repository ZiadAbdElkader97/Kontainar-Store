import React, { useContext, useMemo } from 'react';
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
  Chip,
  CircularProgress,
  Button,
  Avatar,
  Box,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { restoreBlog, permanentDeleteBlog } from 'src/services/blogService';
import { mutate } from 'swr';
import { Link as RouterLink } from 'react-router-dom';

function InnerDeleted() {
  const { posts, isLoading, error } = useContext(BlogContext);
  const rows = useMemo(() => (posts || []).filter((p) => p.deleted), [posts]);

  const handleRestore = async (id) => {
    await restoreBlog(id);

    // ✅ تحديث القوائم
    await mutate('/api/data/blog/BlogPosts');
    await mutate('/api/data/blog/BlogPosts?includeDeleted=true');
  };

  const handlePermanentDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this blog? This action cannot be undone.',
      )
    )
      return;
    await permanentDeleteBlog(id);

    // ✅ تحديث القوائم
    await mutate('/api/data/blog/BlogPosts');
    await mutate('/api/data/blog/BlogPosts?includeDeleted=true');
  };

  if (isLoading)
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    );
  if (error) return <Typography color="error">Error loading blogs</Typography>;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Deleted Blogs</Typography>
          <Button variant="outlined" component={RouterLink} to="/blogs/list">
            Back to List
          </Button>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right" sx={{ minWidth: 120 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
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
                <TableCell align="right" sx={{ minWidth: 120 }}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton
                      color="primary"
                      onClick={() => handleRestore(r.id)}
                      aria-label="Restore"
                      size="small"
                      title="Restore Blog"
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handlePermanentDelete(r.id)}
                      aria-label="Permanent Delete"
                      size="small"
                      title="Permanent Delete"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center">No deleted blogs</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function BlogsDeleted() {
  // TODO: استبدلها باندماج API فعلي لجلب العناصر المحذوفة (soft-deleted)
  return (
    <BlogProvider includeDeleted>
      <PageContainer title="Deleted Blogs" description="Soft-deleted blogs">
        <HeaderAlert />
        <HpHeader />
        <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            Deleted Blogs
          </Typography>
          <InnerDeleted />
        </Container>
        <Footer />
        <ScrollToTop />
      </PageContainer>
    </BlogProvider>
  );
}


