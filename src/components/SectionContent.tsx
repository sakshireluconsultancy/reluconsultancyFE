type Props = {
  id?: string;
  title: string;
  children: React.ReactNode;
  alignment?: string;
};

const SectionContent = ({ id, title, children, alignment = "left" }: Props) => (
  <section id={id} className="px-4 md:px-10 max-w-6xl mx-auto container py-10">
    {title && (
      <h2
        className={`text-3xl font-bold mb-6 ${
          alignment ? `text-${alignment}` : `text-left`
        } `}
      >
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default SectionContent;
