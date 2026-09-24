import { generateStaticParams, generateMetadata } from '@/app/shop/[id]/page';
import { products } from '@/lib/products';

describe('product detail route static generation', () => {
  it('generates a static param for every product', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(products.length);
    expect(params).toEqual(expect.arrayContaining(products.map((p) => ({ id: p.id }))));
  });

  it('builds metadata from the matching product', async () => {
    const target = products[0];
    const metadata = await generateMetadata({ params: Promise.resolve({ id: target.id }) });
    expect(metadata.title).toBe(target.name);
    expect(metadata.description).toBe(target.desc);
  });

  it('returns empty metadata for an unknown product id', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: 'not-a-real-product' }) });
    expect(metadata).toEqual({});
  });
});
