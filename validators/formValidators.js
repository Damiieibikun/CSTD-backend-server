const { z } = require('zod');

const registerSchema = z.object({
  firstname: z.string().min(1, "*First name is required"),
    lastname: z.string().min(1, "*Last name is required"),
     email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    role: z.string().optional(),
    phone: z.string().min(10, "*Phone number must be at least 10 digits")
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "*Phone number must contain only digits"
      ),
    password: z.string().min(6, "*Password must be at least 6 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
        "*Password must be at least 4 characters, include a number and a special character. digits"
      ),
});

const editAdminSchema = z
  .object({
    id: z.string().min(1, 'Admin ID is required'),
    firstname: z.string().min(1, "*First name is required"),
    lastname: z.string().min(1, "*Last name is required"), 
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    phone: z.string().min(10, "*Phone number must be at least 10 digits")
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "*Phone number must contain only digits"
      )  
  });


const loginSchema = z
  .object({
    email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
    password: z.string().min(1, "*Password cannot be empty"),
  })

const changePasswordSchema = z
  .object({   
    id: z.string().min(1, 'Admin ID is required'),
    currentPassword: z.string().min(1, "*Password cannot be empty"),
    newPassword: z.string().min(6, "*Password must be at least 6 characters")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/,
        "*Must be at least 6 characters, include a number and a special character"
      ),
    passwordConfirm: z.string().min(1, "*Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "*Passwords do not match",
});

// Links and pages
const childLinkSchema = z.object({
  pageName: z.string().min(1, { message: 'Child page name is required' }),
  pageType: z.string().min(1, { message: 'Child page type is required' }),
  path: z.string().min(1, { message: 'Child path is required' }),
});


const pageSchema =z.object({
  pageId: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Page ID is required' }),

  pageName: z
    .string()
    .min(1, { message: 'Page name is required' }),

  pageType: z
    .string()
    .min(1, { message: 'Page type is required' }),

  icon: z
    .string()
    .optional()
    .or(z.literal('')),
    
  path: z
    .string()
    .min(1, { message: 'Path is required' }),

  order: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),

  children: z
    .array(childLinkSchema)
    .optional()
    .default([]),

  content: z
    .record(z.any())
    .optional()
    .default({}),

  isHidden: z
    .boolean()
    .optional()
    .default(false),
});



// Footer
const linkSchema = z.object({
  id: z.number().int().nonnegative(),
  text: z.string().min(1, "Link text is required"),
  url: z.string().url("Invalid URL format")
});

const columnSchema = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1, "Column title is required"),
  links: z.array(linkSchema).default([])
});

const socialLinkSchema = z.object({
  id: z.number().int().nonnegative(),
  platform: z.string().min(1, "Platform is required"),
  url: z.url("Invalid URL format")
});

const footerSchema = z.object({
  logo: z.url("Logo must be a valid URL").nullable().optional(),
  description: z.string().optional(),
  copyright: z.string().optional(),
  columns: z.array(columnSchema).default([]),
  socialLinks: z.array(socialLinkSchema).default([])
});


// Projects
const projectsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  objective: z.string().min(1, 'Objective is required'),
  importance: z.string().optional(),
  technology: z.string().optional(),
  partners: z.string().optional(),
  output: z.string().optional(),
  image: z.string().optional(),
});

  // Publications
  const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  authors: z
    .string()
    .regex(/^([A-Za-z\s]+,\s)*[A-Za-z\s]+$/, "Authors must be comma-separated with a space after each comma"),
  link: z.url("Invalid URL"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be included"),
});

// News
const newsSchema = z.object({
  title: z.string().min(3, "Title is required"),
  date: z.string().min(1, "Date is required"), 
  brief: z.string().min(10, "Brief description is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        url: z.string().min(1, "Media URL is required"),
        thumbnail: z.string().optional()
      })
    )
    .optional()
});

// Events

const eventSchema = z.object({
  title: z.string().min(1, "*Event title is required")
    .max(200, "*Title must be less than 200 characters"),
  description: z.string().min(1, "*Event description is required")
    .min(10, "*Description must be at least 10 characters")
    .max(1000, "*Description must be less than 1000 characters"),
  date: z.string().min(1, "*Event date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "*Date must be in YYYY-MM-DD format"),
  time: z.string().min(1, "*Event time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "*Time must be in HH:MM format"),
  location: z.string().min(1, "*Event location is required")
    .max(300, "*Location must be less than 300 characters"),
  flyer:  z.string().optional(),
});

const feedbackSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name cannot be empty'),
    
 email: z.email({ message: "*Invalid email format" }) 
            .min(1, "*Email is required"),
  phone: z
    .string()
    .optional()
    .or(z.literal('')),

  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message cannot be empty'),
  source: z.string().optional(),
});

module.exports = {  
  // Admin
  registerSchema,
  editAdminSchema,
  loginSchema,
  changePasswordSchema,
  
  // pages
  pageSchema,

  // Footer
  linkSchema,
  columnSchema,
  socialLinkSchema,
  footerSchema,

  // News
  newsSchema,

  //Events
  eventSchema,

  // Projects
  projectsSchema,
  //Publications
  publicationSchema,

  // Feedback
  feedbackSchema,
};