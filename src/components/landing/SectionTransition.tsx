const SectionTransition = () => {
  return (
    <div className="w-full py-1">
      <div
        className="h-[2px] w-full animate-gradient-sweep"
        style={{
          background: "linear-gradient(90deg, #0F241A, #5C7928, #879D48, #5C7928, #0F241A)",
          backgroundSize: "200% auto",
        }}
      />
    </div>
  );
};

export default SectionTransition;
