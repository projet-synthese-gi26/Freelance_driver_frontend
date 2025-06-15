import Link from 'next/link';

interface Boxelement{
  Icon:React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
  title:string;
  link:string;
}

const IndexPage = ({Icon,title,link}:Boxelement) => (
  <div>
      <Link href={link}>
        <div className={`flex flex-row items-center justify-center p-4 bg-primary text-white rounded-md text-center hover:shadow-lg transition duration-300`}>
          <span className="mr-2 inline-block text-base sm:text-lg lg:text-xl font-bold">{title}</span>
          <Icon className="w-9 h-9"/>
        </div>
      </Link>
  </div>
);

export default IndexPage;
