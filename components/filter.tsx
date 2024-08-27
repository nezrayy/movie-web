import SelectElement from "@/components/select-element";

const Filter = () => {
  return (
    // <div className="flex flex-col xl:flex-row items-center justify-between p-4 space-y-4 xl:space-y-0 xl:space-x-4">
    //   <div className="flex flex-wrap justify-start items-center space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
    //     <span className="text-gray-600 font-extrabold">Filtered by:</span>
    //     <SelectElement 
    //       label="Year"
    //       elements={['2020', '2021', '2022']}
    //     />
    //     <SelectElement 
    //       label="Genre"
    //       elements={['Action', 'Adventure', 'Sci-Fi']}
    //     />
    //     <SelectElement 
    //       label="Status"
    //       elements={['Ongoing', 'Completed']}
    //     />
    //     <SelectElement 
    //       label="Availability"
    //       elements={['Free', 'Paid']}
    //     />
    //     <SelectElement 
    //       label="Award"
    //       elements={['Oscar', 'Golden Globe']}
    //     />
    //     <SelectElement 
    //       label="Sorted By"
    //       elements={['A-Z', 'Z-A']}
    //     />
    //   </div>

    //   <button className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none">
    //     Submit
    //   </button>
    // </div>
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center p-4">
      <span className="text-gray-600 font-extrabold lg:col-span-1">Filtered by:</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:col-span-5">
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

      <div className="lg:col-span-6 flex justify-center lg:justify-end">
        <button className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none">
          Submit
        </button>
      </div>
    </div>
  )
}

export default Filter