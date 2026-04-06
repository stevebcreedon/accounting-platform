interface KeyTakeawaysProps {
  children: React.ReactNode;
}

export function KeyTakeaways({ children }: KeyTakeawaysProps) {
  return (
    <div className="bg-burnt-orange-50/50 border-l-4 border-burnt-orange-500 rounded-r-lg p-6 mb-12">
      <h2 className="font-heading text-h3 text-charcoal mb-4"><span className="text-burnt-orange-500">Key</span> Takeaways</h2>
      <div className="space-y-2 text-stone-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:marker:text-burnt-orange-500">
        {children}
      </div>
    </div>
  );
}
