import SelectElement from "@/components/select-element";

const Filter = () => {
  return (
    <div className="grid grid-cols-1 gap-4 items-center p-4 max-w-screen-lg mx-auto">
      <span className="text-gray-600 font-extrabold col-span-1">Filtered by:</span>
      <div className="grid grid-cols-2 gap-4 col-span-1">
        <SelectElement 
          label="Year"
          elements={['2020', '2021', '2022']}
        />
        <SelectElement 
          label="Genre"
          elements={['Action', 'Adventure', 'Sci-Fi']}
        />
        <SelectElement 
          label="Status"
          elements={['Ongoing', 'Completed']}
        />
        <SelectElement 
          label="Availability"
          elements={['Free', 'Paid']}
        />
        <SelectElement 
          label="Award"
          elements={['Oscar', 'Golden Globe']}
        />
        <SelectElement 
          label="Sorted By"
          elements={['A-Z', 'Z-A']}
        />
      </div>

      <div className="col-span-1 flex justify-center">
        <button className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none">
          Submit
        </button>
      </div>
    </div>
  )
}

export default Filter