import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/?category=${category.id}`}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${category.color} p-1 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full rounded-full object-cover bg-white"
        />
      </div>
      <span className="text-xs md:text-sm font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
