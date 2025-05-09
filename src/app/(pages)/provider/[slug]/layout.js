export async function generateMetadata({ params }) {
    try {
      // Wait for params to be resolved
      const { slug } = await params;
      
      if (!slug) {
        return {
          title: 'Provider Detail',
          description: 'View provider details',
        };
      }
  
      // Convert the slug to a readable title
      const readableTitle = decodeURIComponent(slug)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  
      return {
        title: `${readableTitle}, Online Provider | Season Decor`,
        description: `View details for ${readableTitle}`,
      };
    } catch (error) {
      console.error('Error generating metadata:', error);
      return {
        title: 'Product Detail',
        description: 'View product details',
      };
    }
  }
  
  export default function Layout({ children }) {
    return children;
  }
  