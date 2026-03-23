export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string | null;
  is_edited: boolean;
  comment_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  replies?: Comment[];
}
