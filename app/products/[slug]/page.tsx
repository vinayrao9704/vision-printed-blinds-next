import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productCategories, getProductCategory } from '@/lib/productCategories';
import ProductCategoryPage from '@/components/ProductCategoryPage';

export function generateStaticParams() {
  return productCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.heroIntro,
  };
}

export default async function ProductCategoryRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) notFound();

  return <ProductCategoryPage category={category} />;
}
