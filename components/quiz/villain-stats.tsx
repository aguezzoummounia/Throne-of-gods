import Text from "../ui/text";

const Stat: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-2.5">
      <Text as="span" variant="small" className="">
        {title}:
      </Text>
      <Text as="span" variant="small">
        {value}
      </Text>
    </div>
  );
};

export default Stat;
