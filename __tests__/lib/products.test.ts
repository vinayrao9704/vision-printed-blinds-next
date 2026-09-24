import { products, tagLabels } from '@/lib/products';

describe('products data integrity', () => {
  it('has at least one product', () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it('every product has a unique id', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every product has required non-empty fields', () => {
    products.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.scene).toBeTruthy();
      expect(p.desc).toBeTruthy();
      expect(Array.isArray(p.category)).toBe(true);
      expect(p.category.length).toBeGreaterThan(0);
      expect(Array.isArray(p.tags)).toBe(true);
    });
  });

  it('every tag used by a product has a corresponding label', () => {
    const allTags = new Set(products.flatMap((p) => p.tags));
    allTags.forEach((tag) => {
      expect(tagLabels[tag]).toBeDefined();
    });
  });

  it('scene class names follow the "scene--*" convention used by the CSS', () => {
    products.forEach((p) => {
      expect(p.scene).toMatch(/^scene--[a-z0-9-]+$/);
    });
  });
});
