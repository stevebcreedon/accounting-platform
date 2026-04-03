import * as runtime from 'react/jsx-runtime';
import { KeyTakeaways } from '@/components/article/key-takeaways';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const sharedComponents = {
  KeyTakeaways,
  // FAQSection will be added in Plan 02 when the FAQ client component is built
};

interface MDXContentProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
