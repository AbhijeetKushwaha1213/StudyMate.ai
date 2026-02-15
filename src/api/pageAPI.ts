import { supabase } from '@/integrations/supabase/client';
import type { Page, CreatePageInput, UpdatePageInput } from '@/types/notion';

/**
 * Page API - CRUD operations for pages
 */

/**
 * Create a new page
 */
export async function createPage(data: CreatePageInput): Promise<Page> {
  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('Page title is required');
  }

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Prepare page data
  const pageData = {
    user_id: user.id,
    title: data.title.trim(),
    parent_id: data.parent_id ?? null,
    icon: data.icon ?? null,
    cover_image: data.cover_image ?? null,
    content: data.content ?? [],
    position: data.position ?? 0,
    is_favorite: false,
  };

  // Insert page
  const { data: page, error } = await supabase
    .from('pages')
    .insert(pageData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }

  return page as Page;
}

/**
 * Get a page by ID
 */
export async function getPage(id: string): Promise<Page> {
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    throw new Error(`Failed to get page: ${error.message}`);
  }

  if (!page) {
    throw new Error('Page not found');
  }

  return page as Page;
}

/**
 * Update a page
 */
export async function updatePage(id: string, data: UpdatePageInput): Promise<Page> {
  // Validate title if provided
  if (data.title !== undefined && data.title.trim().length === 0) {
    throw new Error('Page title cannot be empty');
  }

  // Prepare update data
  const updateData: Partial<Page> & { updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) {
    updateData.title = data.title.trim();
  }
  if (data.icon !== undefined) {
    updateData.icon = data.icon;
  }
  if (data.cover_image !== undefined) {
    updateData.cover_image = data.cover_image;
  }
  if (data.content !== undefined) {
    updateData.content = data.content;
  }
  if (data.position !== undefined) {
    updateData.position = data.position;
  }
  if (data.is_favorite !== undefined) {
    updateData.is_favorite = data.is_favorite;
  }

  // Update page
  const { data: page, error } = await supabase
    .from('pages')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update page: ${error.message}`);
  }

  if (!page) {
    throw new Error('Page not found');
  }

  return page as Page;
}

/**
 * Delete a page (soft delete)
 */
export async function deletePage(id: string): Promise<void> {
  const { error } = await supabase
    .from('pages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Failed to delete page: ${error.message}`);
  }
}

/**
 * Move a page to a new parent and/or position
 */
export async function movePage(
  id: string,
  newParentId: string | null,
  position: number
): Promise<Page> {
  // Validate that we're not creating a circular reference
  if (newParentId) {
    const ancestors = await getPageAncestors(newParentId);
    if (ancestors.some(ancestor => ancestor.id === id)) {
      throw new Error('Cannot move page to its own descendant');
    }
  }

  // Update page parent and position
  const { data: page, error } = await supabase
    .from('pages')
    .update({
      parent_id: newParentId,
      position: position,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to move page: ${error.message}`);
  }

  if (!page) {
    throw new Error('Page not found');
  }

  return page as Page;
}

/**
 * Get child pages of a parent (or root pages if parentId is null)
 */
export async function getPageChildren(parentId: string | null): Promise<Page[]> {
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('position', { ascending: true });

  if (parentId === null) {
    query = query.is('parent_id', null);
  } else {
    query = query.eq('parent_id', parentId);
  }

  const { data: pages, error } = await query;

  if (error) {
    throw new Error(`Failed to get child pages: ${error.message}`);
  }

  return (pages || []) as Page[];
}

/**
 * Get ancestors of a page (for breadcrumb navigation)
 * Returns array from root to immediate parent
 */
export async function getPageAncestors(pageId: string): Promise<Page[]> {
  const ancestors: Page[] = [];
  let currentId: string | null = pageId;

  // Traverse up the hierarchy
  while (currentId) {
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', currentId)
      .is('deleted_at', null)
      .single();

    if (error || !page) {
      break;
    }

    // Don't include the page itself in ancestors
    if (page.id !== pageId) {
      ancestors.unshift(page as Page);
    }

    currentId = page.parent_id;
  }

  return ancestors;
}

/**
 * Toggle favorite status of a page
 */
export async function toggleFavorite(id: string): Promise<Page> {
  // Get current page to check its favorite status
  const currentPage = await getPage(id);
  
  // Toggle the favorite status
  const newFavoriteStatus = !currentPage.is_favorite;
  
  // Update the page
  const { data: page, error } = await supabase
    .from('pages')
    .update({
      is_favorite: newFavoriteStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle favorite: ${error.message}`);
  }

  if (!page) {
    throw new Error('Page not found');
  }

  return page as Page;
}

/**
 * Get all favorited pages for the current user
 */
export async function getFavorites(): Promise<Page[]> {
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Query favorited pages
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .is('deleted_at', null)
    .order('position', { ascending: true });

  if (error) {
    throw new Error(`Failed to get favorites: ${error.message}`);
  }

  return (pages || []) as Page[];
}
