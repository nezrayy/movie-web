import SelectElement from "@/components/select-element";

const Filter = () => {
  return (
    <div>
      <h1 className="font-extrabold mt-3 ml-2">Filter</h1>
      <div className="w-full h-fit py-4 grid grid-cols-[repeat(auto-fit,_minmax(80px,_1fr))] justify-items-center items-center gap-3">
        <SelectElement 
          trigger="Year"
          elements={['2020', '2021', '2022']}
        />
        <SelectElement 
          trigger="Genre"
          elements={['Action', 'Adventure', 'Sci-Fi']}
        />
        <SelectElement 
          trigger="Year"
          elements={['2020', '2021', '2022']}
        />
        <SelectElement 
          trigger="Year"
          elements={['2020', '2021', '2022']}
        />
        <SelectElement 
          trigger="Year"
          elements={['2020', '2021', '2022']}
        />
      </div>
    </div>
  )
}

export default Filter