import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable.jsx';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout.jsx')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout.jsx')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Dashboard.jsx')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce.jsx')));

/* ****Apps***** */
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat.jsx')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes.jsx')));
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar.jsx')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email.jsx')));
// const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog.jsx')));
// const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost.jsx')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets.jsx')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts.jsx')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce.jsx')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail.jsx')));
const EcommerceAddProduct = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceAddProduct.jsx')),
);
const EcommerceEditProduct = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceEditProduct.jsx')),
);
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList.jsx')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout.jsx')),
);
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile.jsx')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers.jsx')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends.jsx')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery.jsx')));
const Invoices = Loadable(lazy(() => import('../views/main-store/invoices/Invoices.jsx')));
const InvoiceCreate = Loadable(lazy(() => import('../views/main-store/invoices/Create.jsx')));
const InvoiceDetail = Loadable(lazy(() => import('../views/main-store/invoices/Detail.jsx')));
const InvoiceEdit = Loadable(lazy(() => import('../views/main-store/invoices/Edit.jsx')));
const Kanban = Loadable(lazy(() => import('../views/apps/kanban/Kanban.jsx')));

// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL.jsx')));

const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing.jsx')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting.jsx')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq.jsx')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards.jsx')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners.jsx')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts.jsx')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete.jsx')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton.jsx')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox.jsx')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio.jsx')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider.jsx')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime.jsx')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch.jsx')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts.jsx')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom.jsx')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard.jsx')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation.jsx')));
const TiptapEditor = Loadable(lazy(() => import('../views/forms/from-tiptap/TiptapEditor.jsx')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal.jsx')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical.jsx')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable.jsx')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable.jsx')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable.jsx')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable.jsx')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable.jsx')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable.jsx')));

//react tables
const ReactBasicTable = Loadable(lazy(() => import('../views/react-tables/basic/page.jsx')));
const ReactColumnVisibilityTable = Loadable(
  lazy(() => import('../views/react-tables/columnvisibility/page.jsx')),
);
const ReactDenseTable = Loadable(lazy(() => import('../views/react-tables/dense/page.jsx')));
const ReactDragDropTable = Loadable(lazy(() => import('../views/react-tables/drag-drop/page.jsx')));
const ReactEditableTable = Loadable(lazy(() => import('../views/react-tables/editable/page.jsx')));
const ReactEmptyTable = Loadable(lazy(() => import('../views/react-tables/empty/page.jsx')));
const ReactExpandingTable = Loadable(
  lazy(() => import('../views/react-tables/expanding/page.jsx')),
);
const ReactFilterTable = Loadable(lazy(() => import('../views/react-tables/filtering/page.jsx')));
const ReactPaginationTable = Loadable(
  lazy(() => import('../views/react-tables/pagination/page.jsx')),
);
const ReactRowSelectionTable = Loadable(
  lazy(() => import('../views/react-tables/row-selection/page.jsx')),
);
const ReactSortingTable = Loadable(lazy(() => import('../views/react-tables/sorting/page.jsx')));
const ReactStickyTable = Loadable(lazy(() => import('../views/react-tables/sticky/page.jsx')));

// chart
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart.jsx')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart.jsx')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart.jsx')));
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart.jsx')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart.jsx')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart.jsx')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart.jsx')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert.jsx')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion.jsx')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar.jsx')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip.jsx')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog.jsx')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList.jsx')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover.jsx')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating.jsx')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs.jsx')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip.jsx')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList.jsx')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography.jsx')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login.jsx')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2.jsx')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register.jsx')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2.jsx')));
const ForgotPassword = Loadable(
  lazy(() => import('../views/authentication/auth1/ForgotPassword.jsx')),
);
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2.jsx')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps.jsx')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2.jsx')));
const Error = Loadable(lazy(() => import('../views/authentication/Error.jsx')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance.jsx')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage.jsx')));

// front end pages
const Homepage = Loadable(lazy(() => import('../views/pages/frontend-pages/Homepage.jsx')));
const About = Loadable(lazy(() => import('../views/pages/frontend-pages/About.jsx')));
const Contact = Loadable(lazy(() => import('../views/pages/frontend-pages/Contact.jsx')));
const Portfolio = Loadable(lazy(() => import('../views/pages/frontend-pages/Portfolio.jsx')));
const PagePricing = Loadable(lazy(() => import('../views/pages/frontend-pages/Pricing.jsx')));
const BlogPage = Loadable(lazy(() => import('../views/pages/frontend-pages/Blog.jsx')));
const BlogPost = Loadable(lazy(() => import('../views/pages/frontend-pages/BlogPost.jsx')));
const BlogsCreate = Loadable(lazy(() => import('../views/apps/blogs/BlogsCreate.jsx')));
const BlogsList = Loadable(lazy(() => import('../views/apps/blogs/BlogsList.jsx')));
const BlogsDeleted = Loadable(lazy(() => import('../views/apps/blogs/BlogsDeleted.jsx')));

// New frontend pages
const BecomeSeller = Loadable(lazy(() => import('../views/pages/frontend-pages/BecomeSeller.jsx')));
const UpcomingOffers = Loadable(
  lazy(() => import('../views/pages/frontend-pages/UpcomingOffers.jsx')),
);

// Policy pages
const PrivacyPolicy = Loadable(
  lazy(() => import('../views/pages/frontend-pages/PrivacyPolicy.jsx')),
);
const ReturnPolicy = Loadable(lazy(() => import('../views/pages/frontend-pages/ReturnPolicy.jsx')));
const RefundPolicy = Loadable(lazy(() => import('../views/pages/frontend-pages/RefundPolicy.jsx')));

// Orders pages
const PendingOrders = Loadable(lazy(() => import('../views/main-store/orders/PendingOrders.jsx')));
const ReceivedOrders = Loadable(
  lazy(() => import('../views/main-store/orders/ReceivedOrders.jsx')),
);
const ListOrders = Loadable(lazy(() => import('../views/main-store/orders/ListOrders.jsx')));

// Products pages
const AddProduct = Loadable(lazy(() => import('../views/main-store/products/AddProduct.jsx')));
const ListProducts = Loadable(lazy(() => import('../views/main-store/products/ListProducts.jsx')));
const DeletedProducts = Loadable(
  lazy(() => import('../views/main-store/products/DeletedProducts.jsx')),
);
const EditProduct = Loadable(lazy(() => import('../views/main-store/products/EditProduct.jsx')));

// Shop page
const Shop = Loadable(lazy(() => import('../views/main-store/products/Shop.jsx')));

const AddCategory = Loadable(lazy(() => import('../views/main-store/categories/AddCategory.jsx')));
const ListCategories = Loadable(
  lazy(() => import('../views/main-store/categories/ListCategories.jsx')),
);
const EditCategory = Loadable(
  lazy(() => import('../views/main-store/categories/EditCategory.jsx')),
);

//mui charts
const BarCharts = Loadable(lazy(() => import('../views/muicharts/barcharts/page.jsx')));
const GaugeCharts = Loadable(lazy(() => import('../views/muicharts/gaugecharts/page.jsx')));
const AreaCharts = Loadable(lazy(() => import('../views/muicharts/linecharts/area/page.jsx')));
const LineCharts = Loadable(lazy(() => import('../views/muicharts/linecharts/line/page.jsx')));
const PieCharts = Loadable(lazy(() => import('../views/muicharts/piecharts/page.jsx')));
const ScatterCharts = Loadable(lazy(() => import('../views/muicharts/scattercharts/page.jsx')));
const SparklineCharts = Loadable(lazy(() => import('../views/muicharts/sparklinecharts/page.jsx')));

//mui tree
const SimpletreeCustomization = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-customization/page.jsx')),
);
const SimpletreeExpansion = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-expansion/page.jsx')),
);
const SimpletreeFocus = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-focus/page.jsx')),
);
const SimpletreeItems = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-items/page.jsx')),
);
const SimpletreeSelection = Loadable(
  lazy(() => import('../views/mui-trees/simpletree/simpletree-selection/page.jsx')),
);

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <ModernDash /> },
      { path: '/dashboard', element: <ModernDash /> },
      { path: '/dashboard/ecommerce', element: <EcommerceDash /> },
      { path: '/apps/chat', element: <Chats /> },
      { path: '/apps/notes', element: <Notes /> },
      { path: '/apps/calendar', element: <Calendar /> },
      { path: '/apps/email', element: <Email /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/contacts', element: <Contacts /> },
      { path: '/apps/ecommerce', element: <Ecommerce /> },
      { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      { path: '/apps/ecommerce/add-product', element: <EcommerceAddProduct /> },
      { path: '/apps/ecommerce/edit-product/:id', element: <EcommerceEditProduct /> },
      { path: '/apps/ecommerce/product-list', element: <EcomProductList /> },
      { path: '/apps/ecommerce/checkout', element: <EcomProductCheckout /> },
      { path: '/apps/user-profile', element: <UserProfile /> },
      { path: '/apps/user-profile/followers', element: <Followers /> },
      { path: '/apps/user-profile/friends', element: <Friends /> },
      { path: '/apps/user-profile/gallery', element: <Gallery /> },
      { path: '/main-store/invoices', element: <Invoices /> },
      { path: '/main-store/invoices/create', element: <InvoiceCreate /> },
      { path: '/main-store/invoices/detail/:id', element: <InvoiceDetail /> },
      { path: '/main-store/invoices/edit/:id', element: <InvoiceEdit /> },
      { path: '/apps/kanban', element: <Kanban /> },
      { path: '/pages/rollbase-casl', element: <RollbaseCASL /> },
      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-setting', element: <AccountSetting /> },
      { path: '/pages/faq', element: <Faq /> },
      { path: '/widgets/cards', element: <WidgetCards /> },
      { path: '/widgets/banners', element: <WidgetBanners /> },
      { path: '/widgets/charts', element: <WidgetCharts /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button', element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-elements/datetime', element: <MuiDateTime /> },
      { path: '/forms/form-layouts', element: <FormLayouts /> },
      { path: '/forms/form-custom', element: <FormCustom /> },
      { path: '/forms/form-wizard', element: <FormWizard /> },
      { path: '/forms/form-validation', element: <FormValidation /> },
      { path: '/forms/from-tiptap/tiptap-editor', element: <TiptapEditor /> },
      { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      { path: '/forms/form-vertical', element: <FormVertical /> },
      { path: '/tables/basic-table', element: <BasicTable /> },
      { path: '/tables/collapsible-table', element: <CollapsibleTable /> },
      { path: '/tables/enhanced-table', element: <EnhancedTable /> },
      { path: '/tables/fixed-header-table', element: <FixedHeaderTable /> },
      { path: '/tables/pagination-table', element: <PaginationTable /> },
      { path: '/tables/search-table', element: <SearchTable /> },
      { path: '/react-tables/basic', element: <ReactBasicTable /> },
      { path: '/react-tables/column-visibility', element: <ReactColumnVisibilityTable /> },
      { path: '/react-tables/dense', element: <ReactDenseTable /> },
      { path: '/react-tables/drag-drop', element: <ReactDragDropTable /> },
      { path: '/react-tables/editable', element: <ReactEditableTable /> },
      { path: '/react-tables/empty', element: <ReactEmptyTable /> },
      { path: '/react-tables/expanding', element: <ReactExpandingTable /> },
      { path: '/react-tables/filtering', element: <ReactFilterTable /> },
      { path: '/react-tables/pagination', element: <ReactPaginationTable /> },
      { path: '/react-tables/row-selection', element: <ReactRowSelectionTable /> },
      { path: '/react-tables/sorting', element: <ReactSortingTable /> },
      { path: '/react-tables/sticky', element: <ReactStickyTable /> },
      { path: '/charts/line-chart', element: <LineChart /> },
      { path: '/charts/gradient-chart', element: <GredientChart /> },
      { path: '/charts/doughnut-chart', element: <DoughnutChart /> },
      { path: '/charts/area-chart', element: <AreaChart /> },
      { path: '/charts/column-chart', element: <ColumnChart /> },
      { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      { path: '/ui-components/alert', element: <MuiAlert /> },
      { path: '/ui-components/accordion', element: <MuiAccordion /> },
      { path: '/ui-components/avatar', element: <MuiAvatar /> },
      { path: '/ui-components/chip', element: <MuiChip /> },
      { path: '/ui-components/dialog', element: <MuiDialog /> },
      { path: '/ui-components/list', element: <MuiList /> },
      { path: '/ui-components/popover', element: <MuiPopover /> },
      { path: '/ui-components/rating', element: <MuiRating /> },
      { path: '/ui-components/tabs', element: <MuiTabs /> },
      { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      { path: '/ui-components/typography', element: <MuiTypography /> },
      { path: '/main-store/products/create', element: <AddProduct /> },
      { path: '/main-store/products/list', element: <ListProducts /> },
      { path: '/main-store/products/deleted', element: <DeletedProducts /> },
      { path: '/main-store/products/edit/:id', element: <EditProduct /> },
      { path: '/main-store/products/shop', element: <Shop /> },
      { path: '/main-store/orders/list', element: <ListOrders /> },
      { path: '/main-store/orders/pending', element: <PendingOrders /> },
      { path: '/main-store/orders/received', element: <ReceivedOrders /> },
      { path: '/main-store/categories/create', element: <AddCategory /> },
      { path: '/main-store/categories/list', element: <ListCategories /> },
      { path: '/main-store/categories/edit/:id', element: <EditCategory /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '/frontend-pages/homepage', element: <Homepage /> },
      { path: '/frontend-pages/about', element: <About /> },
      { path: '/frontend-pages/contact', element: <Contact /> },
      { path: '/frontend-pages/portfolio', element: <Portfolio /> },
      { path: '/frontend-pages/pricing', element: <PagePricing /> },
      { path: '/frontend-pages/blog', element: <BlogPage /> },
      { path: '/frontend-pages/blog-post', element: <BlogPost /> },
      { path: '/apps/blogs/create', element: <BlogsCreate /> },
      { path: '/apps/blogs/list', element: <BlogsList /> },
      { path: '/apps/blogs/deleted', element: <BlogsDeleted /> },
      { path: '/frontend-pages/become-seller', element: <BecomeSeller /> },
      { path: '/frontend-pages/upcoming-offers', element: <UpcomingOffers /> },
      { path: '/frontend-pages/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/frontend-pages/return-policy', element: <ReturnPolicy /> },
      { path: '/frontend-pages/refund-policy', element: <RefundPolicy /> },
      { path: '/mui-charts/bar-charts', element: <BarCharts /> },
      { path: '/mui-charts/gauge-charts', element: <GaugeCharts /> },
      { path: '/mui-charts/area-charts', element: <AreaCharts /> },
      { path: '/mui-charts/line-charts', element: <LineCharts /> },
      { path: '/mui-charts/pie-charts', element: <PieCharts /> },
      { path: '/mui-charts/scatter-charts', element: <ScatterCharts /> },
      { path: '/mui-charts/sparkline-charts', element: <SparklineCharts /> },
      { path: '/mui-trees/simpletree-customization', element: <SimpletreeCustomization /> },
      { path: '/mui-trees/simpletree-expansion', element: <SimpletreeExpansion /> },
      { path: '/mui-trees/simpletree-focus', element: <SimpletreeFocus /> },
      { path: '/mui-trees/simpletree-items', element: <SimpletreeItems /> },
      { path: '/mui-trees/simpletree-selection', element: <SimpletreeSelection /> },
    ],
  },
  {
    path: '*',
    element: <Error />,
  },
];

const router = createBrowserRouter(Router);

export default router;
