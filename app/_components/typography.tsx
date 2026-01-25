import { cn } from "@/lib/utils";

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const HEADING_STYLES: Record<1 | 2 | 3 | 4, { tag: "h1" | "h2" | "h3" | "h4"; className: string }> =
  {
    1: { tag: "h1", className: "text-4xl font-extrabold" },
    2: { tag: "h2", className: "text-3xl font-semibold" },
    3: { tag: "h3", className: "text-2xl font-semibold" },
    4: { tag: "h4", className: "text-xl font-semibold" },
  };

const DEFAULT_HEADING_STYLE = "scroll-m-20 tracking-tight text-balance";

const Title = ({ children, level = 1 }: TitleProps) => {
  const { tag: Tag, className } = HEADING_STYLES[level];
  const headingClass = `${DEFAULT_HEADING_STYLE} ${className}`;

  return <Tag className={headingClass}>{children}</Tag>;
};

const Paragraph = ({ children, className, ...props }: ParagraphProps) => {
  return (
    <p className={cn("leading-7 not-first:mt-2 text-sm", className)} {...props}>
      {children}
    </p>
  );
};

export { Title, Paragraph };
