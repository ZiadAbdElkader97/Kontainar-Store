import { Chance } from 'chance';
import { random } from 'lodash';
import { sub } from 'date-fns';
import s1 from 'src/assets/images/blog/blog-img1.jpg';
import s2 from 'src/assets/images/blog/blog-img2.jpg';
import s3 from 'src/assets/images/blog/blog-img3.jpg';
import s4 from 'src/assets/images/blog/blog-img4.jpg';
import s5 from 'src/assets/images/blog/blog-img5.jpg';
import s6 from 'src/assets/images/blog/blog-img6.jpg';
import s7 from 'src/assets/images/blog/blog-img11.jpg';
import s8 from 'src/assets/images/blog/blog-img8.jpg';
import s9 from 'src/assets/images/blog/blog-img9.jpg';
import s10 from 'src/assets/images/blog/blog-img10.jpg';

import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import user3 from 'src/assets/images/profile/user-3.jpg';
import user4 from 'src/assets/images/profile/user-4.jpg';
import user5 from 'src/assets/images/profile/user-5.jpg';
import user6 from 'src/assets/images/profile/user-1.jpg';
import { uniqueId } from 'lodash';

import { http, HttpResponse } from 'msw';
const chance = new Chance();

// دالة لحفظ البيانات في localStorage
const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem('blogPosts', JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// دالة لتحميل البيانات من localStorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('blogPosts');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

const toSlug = (s) =>
  s
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const makePost = (payload) => ({
  id: chance.integer({ min: 1, max: 999999 }),
  title: payload.title,
  slug: payload.slug || toSlug(payload.title),
  subtitle: payload.subtitle || '',
  content: payload.content || '',
  coverImg: payload.cover || null, // استخدام null بدلاً من string فارغ
  createdAt: new Date(),
  view: 0,
  share: 0,
  category: payload.category || 'General',
  tags: payload.tags || [],
  status: payload.status || 'published',
  deleted: false,
  deletedAt: null,
  featured: !!payload.featured,
  author: {
    id: chance.integer({ min: 1, max: 2000 }),
    avatar: user1,
    name: 'Admin',
  },
  comments: [],
});

let BlogComment = [
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [
      {
        id: uniqueId('#comm_'),
        profile: {
          id: chance.integer({ min: 1, max: 2000 }),
          avatar: user3,
          name: chance.name(),
        },
        time: chance.date(),
        comment: chance.paragraph({ sentences: 2 }),
      },
    ],
  },
  {
    id: uniqueId('#comm_'),
    profile: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: chance.name(),
    },
    time: chance.date(),
    comment: chance.paragraph({ sentences: 2 }),
    replies: [],
  },
];

// تحميل البيانات من localStorage أو استخدام البيانات الافتراضية
const defaultBlogPost = [
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Garmins Instinct Crossover is a rugged hybrid smartwatch',
    slug: 'garmins-instinct-crossover-is-a-rugged-hybrid-smartwatch',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s1,
    createdAt: sub(new Date(), { days: 8, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Gadget',
    tags: ['gadget', 'smartwatch'],
    status: 'published', // 'published' | 'draft'
    deleted: false, // soft-delete flag
    deletedAt: null,
    featured: false,
    author: { id: chance.integer({ min: 1, max: 2000 }), avatar: user1, name: chance.name() },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'After Twitter Staff Cuts, Survivors Face ‘Radio Silence',
    slug: 'after-twitter-staff-cuts-survivors-face-radio-silence',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s2,
    createdAt: sub(new Date(), { days: 7, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Lifestyle',
    tags: ['twitter', 'staff', 'cuts'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Apple is apparently working on a new ‘streamlined’ accessibility for iOS',
    slug: 'apple-is-apparently-working-on-a-new-streamlined-accessibility-for-ios',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s3,
    createdAt: sub(new Date(), { days: 5, hours: 2, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Design',
    tags: ['apple', 'accessibility', 'ios'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Why Figma is selling to Adobe for $20 billion',
    slug: 'why-figma-is-selling-to-adobe-for-20-billion',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s4,
    createdAt: sub(new Date(), { days: 7, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Design',
    tags: ['figma', 'adobe', '20 billion'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Streaming video way before it was cool, go dark tomorrow',
    slug: 'streaming-video-way-before-it-was-cool-go-dark-tomorrow',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s5,
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Lifestyle',
    tags: ['streaming', 'video', 'dark'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user5,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'As yen tumbles, gadget-loving Japan goes for secondhand iPhones ',
    slug: 'as-yen-tumbles-gadget-loving-japan-goes-for-secondhand-iphones',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s6,
    createdAt: sub(new Date(), { days: 2, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Gadget',
    tags: ['gadget', 'japan', 'secondhand', 'iphones'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user6,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
    slug: 'intel-loses-bid-to-revive-antitrust-case-against-patent-foe-fortress',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s7,
    createdAt: sub(new Date(), { days: 3, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Social',
    tags: ['intel', 'antitrust', 'patent', 'fortress'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user2,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'COVID outbreak deepens as more lockdowns loom in China',
    slug: 'covid-outbreak-deepens-as-more-lockdowns-loom-in-china',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s8,
    createdAt: sub(new Date(), { days: 4, hours: 6, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Health',
    tags: ['covid', 'outbreak', 'lockdowns', 'china'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: false,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user3,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
    slug: 'early-black-friday-amazon-deals-cheap-tvs-headphones-laptops',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s9,
    createdAt: sub(new Date(), { days: 5, hours: 3, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Gadget',
    tags: ['amazon', 'deals', 'cheap', 'tvs', 'headphones', 'laptops'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user4,
      name: chance.name(),
    },
    comments: BlogComment,
  },
  {
    id: chance.integer({ min: 1, max: 2000 }),
    title: 'Presented by Max Rushden with Barry Glendenning, Philippe Auclair',
    slug: 'presented-by-max-rushden-with-barry-glendenning-philippe-auclair',
    content: chance.paragraph({ sentences: 2 }),
    coverImg: s10,
    createdAt: sub(new Date(), { days: 0, hours: 1, minutes: 20 }),
    view: random(9999),
    share: random(9999),
    category: 'Health',
    tags: ['max', 'rushden', 'barry', 'glendenning', 'philippe', 'auclair'],
    status: 'published',
    deleted: false,
    deletedAt: null,
    featured: true,
    author: {
      id: chance.integer({ min: 1, max: 2000 }),
      avatar: user5,
      name: chance.name(),
    },
    comments: BlogComment,
  },
];

// تهيئة BlogPost مع localStorage
export let BlogPost = (() => {
  const saved = loadFromLocalStorage();
  if (saved && Array.isArray(saved)) {
    return saved;
  }
  saveToLocalStorage(defaultBlogPost);
  return defaultBlogPost;
})();

// Mocked Apis
export const Bloghandlers = [
  // Mock api endpoint to fetch all blogposts
  http.get('/api/data/blog/BlogPosts', ({ request }) => {
    try {
      const url = new URL(request.url);
      const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
      const data = includeDeleted ? BlogPost : BlogPost.filter((p) => !p.deleted);
      return HttpResponse.json({ status: 200, data, msg: 'success' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'something went wrong' });
    }
  }),

  // Mock api endpoint to add post info
  http.post('/api/data/blog/post/add', async ({ request }) => {
    try {
      const { postId, comment } = await request.json();
      const postIndex = BlogPost.findIndex((x) => x.id === postId);
      const post = BlogPost[postIndex];
      const cComments = post.comments || [];
      post.comments = [comment, ...cComments];
      return HttpResponse.json({
        status: 200,
        data: { posts: [...BlogPost] },
        msg: 'success',
      });
    } catch (error) {
      return HttpResponse.json({
        status: 400,
        msg: 'something went wrong',
        error,
      });
    }
  }),

  // إنشاء بوست جديد
  http.post('/api/blogs', async ({ request }) => {
    try {
      const payload = await request.json();
      const post = makePost(payload);
      BlogPost = [post, ...BlogPost];
      saveToLocalStorage(BlogPost);
      return HttpResponse.json({ status: 200, data: post, msg: 'created' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'create failed', error });
    }
  }),

  http.delete('/api/blogs/:id', async ({ params }) => {
    try {
      const id = Number(params.id);
      const idx = BlogPost.findIndex((x) => Number(x.id) === id);
      if (idx === -1) return HttpResponse.json({ status: 404, msg: 'not found' });
      BlogPost[idx].deleted = true;
      BlogPost[idx].deletedAt = new Date();
      saveToLocalStorage(BlogPost);
      return HttpResponse.json({ status: 200, data: BlogPost[idx], msg: 'deleted' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'delete failed', error });
    }
  }),

  http.patch('/api/blogs/:id/restore', async ({ params }) => {
    try {
      const id = Number(params.id);
      const idx = BlogPost.findIndex((x) => Number(x.id) === id);
      if (idx === -1) return HttpResponse.json({ status: 404, msg: 'not found' });
      BlogPost[idx].deleted = false;
      BlogPost[idx].deletedAt = null;
      saveToLocalStorage(BlogPost);
      return HttpResponse.json({ status: 200, data: BlogPost[idx], msg: 'restored' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'restore failed', error });
    }
  }),

  // حذف نهائي
  http.delete('/api/blogs/:id/permanent', async ({ params }) => {
    try {
      const id = Number(params.id);
      const idx = BlogPost.findIndex((x) => Number(x.id) === id);
      if (idx === -1) return HttpResponse.json({ status: 404, msg: 'not found' });
      BlogPost.splice(idx, 1);
      saveToLocalStorage(BlogPost);
      return HttpResponse.json({ status: 200, msg: 'permanently deleted' });
    } catch (error) {
      return HttpResponse.json({ status: 400, msg: 'permanent delete failed', error });
    }
  }),
];


