import Image from "next/image";
import errorImg from "@public/img/error-img.png";
import Link from "next/link";

const error = async () => {
  return (
    <div
      className="py-[30px] lg:py-[60px] bg-[var(--bg-2)]"
      style={{ height: "100vh" }}
    >
      <div className="container">
        <div className="flex justify-center">
          <div className="col-span-10 lg:col-span-6">
            <div className="text-center flex flex-col gap-28">
              <h2 className="mt-10  h2"> Oops! Page Not Found </h2>

{/*               <Image src={errorImg} alt="image" className="mx-auto w-full" /> */}
              <Link href="/" className="text-white bg-blue-900 px-2.5 py-2 mx-auto rounded-md font-semibold">
                <span className="inline-block"> Back To Home </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default error;
