import React, { useEffect, useState } from "react";
import Image from "next/image";

const ImageModal = ({
  //   showModal,
  setShowModal,
  imgSrc,
}: {
  //   showModal: false;
  setShowModal: (show: boolean) => void;
  imgSrc: string;
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [imgSrc]);
  return (
    <>
      <div className="absolute top-0 left-0 flex h-[100vh] w-[100vw] justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-400 bg-opacity-90">
        <div className="relative w-full h-full my-6 mx-auto">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col justify-center items-center w-full h-full outline-none focus:outline-none">
            <Image
              src={imgSrc}
              width={1330}
              height={700}
              alt="screenshot of working application"
              //   w-[570px] h-[300px] sm:w-[1330px] sm:h-[700px]
              className="rounded-md col-span-3 sm:col-span-1"
            />
            {/* <div className="absolute top-0 right-0 flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"> */}
            <button
              className="absolute top-0 right-4 text-gray-900 bg-white font-bold w-10 h-10 rounded-full text-xl outline-none focus:outline-none"
              type="button"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            {/* <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Submit
                  </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
      {/* </>
      ) : null} */}
    </>
  );
};

export default ImageModal;
