"use client";
import Link from "next/link";
import React, { ChangeEvent, useRef, useState } from "react";

const Page=() => {
  const [en1, setEn1] = useState(false);
  const [en2, setEn2] = useState(false);
  return (
    <div>
      <h1>Titre de la page</h1>
      <p>Contenu de la page</p>
    </div>
  );
};

export default Page;
