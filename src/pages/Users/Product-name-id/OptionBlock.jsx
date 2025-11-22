// components/OptionBlock.jsx
const OptionBlock = ({ label, values, selected, onSelect, isDisabled }) => {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <h3 className="font-semibold">{label}:</h3>
      <div className="flex gap-2 flex-wrap">
        {values.map((val) => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            disabled={isDisabled && !isDisabled(val)}
            className={`px-3 py-1 rounded border ${
              selected === val ? "border-black font-bold" : "border-gray-300"
            } ${
              isDisabled && !isDisabled(val)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                : "hover:bg-gray-100"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionBlock;
