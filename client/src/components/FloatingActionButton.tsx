import { Link } from 'wouter';

const FloatingActionButton = () => {
  return (
    <div className="fixed right-6 bottom-6 sm:hidden">
      <Link href="/ask">
        <a className="fab flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl">
          <span className="material-icons">add</span>
        </a>
      </Link>
    </div>
  );
};

export default FloatingActionButton;
