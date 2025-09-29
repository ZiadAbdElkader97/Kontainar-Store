import { Contacthandlers } from 'src/api/contacts/ContactsData';
import { Chathandlers } from 'src/api/chat/Chatdata';
import { Ecommercehandlers } from 'src/api/eCommerce/ProductsData';
import { PostHandlers } from 'src/api/userprofile/PostData';
import { UserDataHandlers } from 'src/api/userprofile/UsersData';
import { Bloghandlers } from 'src/api/blog/blogData';
import { NotesHandlers } from 'src/api/notes/NotesData';
import { TicketHandlers } from 'src/api/ticket/TicketData';
import { Emailhandlers } from 'src/api/email/EmailData';
import { Kanbanhandlers } from 'src/api/kanban/KanbanData';
import { InvoiceHandlers } from 'src/api/invoices/InvoicesData';
import { BrandHandlers } from 'src/api/brands/BrandsData';
import { CouponHandlers } from 'src/api/coupons/CouponsData';
import { ReviewHandlers } from 'src/api/reviews/ReviewsData';
import { SettingsHandlers } from 'src/api/settings/SettingsData';
import { AllUsersHandlers } from 'src/api/user-management/AllUsersData';

export const mockHandlers = [
  ...Contacthandlers,
  ...Chathandlers,
  ...Ecommercehandlers,
  ...UserDataHandlers,
  ...PostHandlers,
  ...Bloghandlers,
  ...NotesHandlers,
  ...TicketHandlers,
  ...Emailhandlers,
  ...Kanbanhandlers,
  ...InvoiceHandlers,
  ...BrandHandlers,
  ...CouponHandlers,
  ...ReviewHandlers,
  ...SettingsHandlers,
  ...AllUsersHandlers,
];
