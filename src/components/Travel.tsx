import duabiImg from "../images/dubai.jpg";
import capriImg from "../images/italy.jpg";
import parisimg from "../images/france.jpg";
import newyorkImg from "../images/us.jpg";

const Travels = () => {
    const travelDestinations = [
      
      {
        name: "Dubai, Emirati Arabi",
        image: duabiImg,
        description: "Il futuro prende vita tra lusso e grattacieli nel deserto."
      },
      {
        name: "Capri, Italia",
        image: capriImg,
        description: "Un'isola da sogno nel cuore del Mediterraneo."
      },
      {
        name: "Parigi, Francia",
        image: parisimg,
        description: "La città dell'amore e della Torre Eiffel."
      },
      {
        name: "New York, USA",
        image: newyorkImg,
        description: "La città che non dorme mai, cuore della finanza e cultura."
      }
    ];
  
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Le nostre destinazioni
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {travelDestinations.map((destination, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{destination.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Travels;
  