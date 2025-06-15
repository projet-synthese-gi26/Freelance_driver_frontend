const Page=()=>{
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600">403</h1>
            <p className="mt-4 text-xl">Accès non autorisé</p>
            <p className="mt-2 text-gray-600">
              Désolé, vous n'avez pas la permission d'accéder à cette page.
            </p>
            <a href="/" className="mt-6 inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Retour à l'accueil
            </a>
          </div>
        </div>
      );
}

export default Page