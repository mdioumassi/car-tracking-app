import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Système de Gestion de Véhicules</h1>
          <nav className="flex space-x-4 bg-gray-100 p-4 rounded-md">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Accueil</Link>
            <Link to="/owners" className="text-blue-600 hover:text-blue-800">Propriétaires</Link>
            <Link to="/drivers" className="text-blue-600 hover:text-blue-800">Conducteurs</Link>
            <Link to="/cars" className="text-blue-600 hover:text-blue-800">Véhicules</Link>
            <Link to="/routes" className="text-blue-600 hover:text-blue-800">Trajets</Link>
            <Link to="/map" className="text-blue-600 hover:text-blue-800">Carte</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/owners" element={<OwnersList />} />
            <Route path="/owners/:id" element={<OwnerDetail />} />
            <Route path="/drivers" element={<DriversList />} />
            <Route path="/drivers/:id" element={<DriverDetail />} />
            <Route path="/cars" element={<CarsList />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/routes" element={<RoutesList />} />
            <Route path="/routes/:id" element={<RouteDetail />} />
            <Route path="/map" element={<PositionMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Page d'accueil/Dashboard
function Dashboard() {
  const [stats, setStats] = useState({
    ownersCount: 0,
    driversCount: 0,
    carsCount: 0,
    routesCount: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ownersRes = await fetch('http://localhost:3000/api/owners');
        const driversRes = await fetch('http://localhost:3000/api/drivers');
        const carsRes = await fetch('http://localhost:3000/api/cars');
        const routesRes = await fetch('http://localhost:3000/api/routes');
        
        const owners = await ownersRes.json();
        const drivers = await driversRes.json();
        const cars = await carsRes.json();
        const routes = await routesRes.json();
        
        setStats({
          ownersCount: Array.isArray(owners) ? owners.length : 0,
          driversCount: Array.isArray(drivers) ? drivers.length : 0,
          carsCount: Array.isArray(cars) ? cars.length : 0,
          routesCount: Array.isArray(routes) ? routes.length : 0
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Propriétaires" count={stats.ownersCount} link="/owners" bgColor="bg-blue-100" />
        <StatCard title="Conducteurs" count={stats.driversCount} link="/drivers" bgColor="bg-green-100" />
        <StatCard title="Véhicules" count={stats.carsCount} link="/cars" bgColor="bg-yellow-100" />
        <StatCard title="Trajets" count={stats.routesCount} link="/routes" bgColor="bg-purple-100" />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <PositionMap mini={true} />
      </div>
    </div>
  );
}

// Composant carte statistique pour le dashboard
function StatCard({ title, count, link, bgColor }) {
  return (
    <Link to={link} className={`${bgColor} p-6 rounded-lg shadow hover:shadow-md transition-shadow`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </Link>
  );
}

// Composant activités récentes
function RecentActivities() {
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    const fetchRecentRoutes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/routes');
        const data = await response.json();
        // Tri par date (plus récent d'abord) et limite à 5 résultats
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
          : [];
        setRoutes(sortedData);
      } catch (error) {
        console.error("Erreur lors du chargement des trajets récents:", error);
      }
    };
    
    fetchRecentRoutes();
  }, []);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Trajets récents</h3>
      {routes.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {routes.map(route => (
            <li key={route.id} className="py-3">
              <Link to={`/routes/${route.id}`} className="hover:text-blue-600">
                <div className="flex justify-between">
                  <span>{new Date(route.start_date).toLocaleDateString()} - {route.car?.registration || 'N/A'}</span>
                  <span>{route.distance_traveled} km</span>
                </div>
                <p className="text-sm text-gray-600">Coût: {route.travel_cost} €</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun trajet récent</p>
      )}
    </div>
  );
}

// Liste des propriétaires
function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/owners');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        setOwners(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOwners();
  }, []);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des propriétaires</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter un propriétaire
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {owners.map(owner => (
              <tr key={owner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{owner.firstname} {owner.lastname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{owner.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{owner.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/owners/${owner.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Détails</Link>
                  <button className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Détail d'un propriétaire
function OwnerDetail() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails du propriétaire
        const ownerRes = await fetch(`http://localhost:3000/api/owners/${id}`);
        if (!ownerRes.ok) throw new Error('Erreur lors du chargement des données du propriétaire');
        const ownerData = await ownerRes.json();
        setOwner(ownerData);
        
        // Récupérer les voitures associées au propriétaire
        const carsRes = await fetch(`http://localhost:3000/api/cars?owner_id=${id}`);
        if (!carsRes.ok) throw new Error('Erreur lors du chargement des voitures');
        const carsData = await carsRes.json();
        setCars(Array.isArray(carsData) ? carsData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOwnerData();
  }, [id]);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  if (!owner) return <div className="text-center py-8">Propriétaire non trouvé</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Détails du propriétaire</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
            <p><span className="font-semibold">Nom:</span> {owner.firstname} {owner.lastname}</p>
            <p><span className="font-semibold">Email:</span> {owner.email}</p>
            <p><span className="font-semibold">Téléphone:</span> {owner.phone}</p>
            <p><span className="font-semibold">Adresse:</span> {owner.address}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Informations système</h3>
            <p><span className="font-semibold">ID:</span> {owner.id}</p>
            <p><span className="font-semibold">Créé le:</span> {new Date(owner.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold">Mis à jour le:</span> {new Date(owner.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Véhicules associés</h3>
      {cars.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conducteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{car.registration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{car.marque}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{car.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {car.driver ? `${car.driver.firstname} ${car.driver.lastname}` : 'Non assigné'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/cars/${car.id}`} className="text-blue-600 hover:text-blue-900">Détails</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="bg-white p-6 rounded-lg shadow text-gray-500">Aucun véhicule associé à ce propriétaire.</p>
      )}
    </div>
  );
}

// Liste des conducteurs
function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/drivers');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        setDrivers(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
  }, []);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des conducteurs</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter un conducteur
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Permis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{driver.firstname} {driver.lastname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{driver.phone_mobile}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{driver.permis}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {driver.current_position ? driver.current_position : 'Non disponible'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/drivers/${driver.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Détails</Link>
                  <button className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Détail d'un conducteur
function DriverDetail() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails du conducteur
        const driverRes = await fetch(`http://localhost:3000/api/drivers/${id}`);
        if (!driverRes.ok) throw new Error('Erreur lors du chargement des données du conducteur');
        const driverData = await driverRes.json();
        setDriver(driverData);
        
        // Récupérer les voitures associées au conducteur
        const carsRes = await fetch(`http://localhost:3000/api/cars?driver_id=${id}`);
        if (!carsRes.ok) throw new Error('Erreur lors du chargement des voitures');
        const carsData = await carsRes.json();
        setCars(Array.isArray(carsData) ? carsData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverData();
  }, [id]);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  if (!driver) return <div className="text-center py-8">Conducteur non trouvé</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Détails du conducteur</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
            <p><span className="font-semibold">Nom:</span> {driver.firstname} {driver.lastname}</p>
            <p><span className="font-semibold">Téléphone:</span> {driver.phone_mobile}</p>
            <p><span className="font-semibold">Adresse:</span> {driver.address}</p>
            <p><span className="font-semibold">N° Permis:</span> {driver.permis}</p>
            <p><span className="font-semibold">Position actuelle:</span> {driver.current_position || 'Non disponible'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Informations système</h3>
            <p><span className="font-semibold">ID:</span> {driver.id}</p>
            <p><span className="font-semibold">Créé le:</span> {new Date(driver.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold">Mis à jour le:</span> {new Date(driver.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Véhicules assignés</h3>
      {cars.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{car.registration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{car.marque}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{car.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {car.owner ? `${car.owner.firstname} ${car.owner.lastname}` : 'Non assigné'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/cars/${car.id}`} className="text-blue-600 hover:text-blue-900">Détails</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="bg-white p-6 rounded-lg shadow text-gray-500">Aucun véhicule assigné à ce conducteur.</p>
      )}
    </div>
  );
}

// Liste des voitures
function CarsList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/cars');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        setCars(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des véhicules</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter un véhicule
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque/Modèle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conducteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{car.registration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{car.marque} {car.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {car.owner ? `${car.owner.firstname} ${car.owner.lastname}` : 'Non assigné'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {car.driver ? `${car.driver.firstname} ${car.driver.lastname}` : 'Non assigné'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/cars/${car.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Détails</Link>
                  <button className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Détail d'une voiture
function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de la voiture
        const carRes = await fetch(`http://localhost:3000/api/cars/${id}`);
        if (!carRes.ok) throw new Error('Erreur lors du chargement des données du véhicule');
        const carData = await carRes.json();
        setCar(carData);
        
        // Récupérer les trajets associés à la voiture
        const routesRes = await fetch(`http://localhost:3000/api/routes?car_id=${id}`);
        if (!routesRes.ok) throw new Error('Erreur lors du chargement des trajets');
        const routesData = await routesRes.json();
        setRoutes(Array.isArray(routesData) ? routesData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
  }, [id]);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  if (!car) return <div className="text-center py-8">Véhicule non trouvé</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Détails du véhicule</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations du véhicule</h3>
            <p><span className="font-semibold">Immatriculation:</span> {car.registration}</p>
            <p><span className="font-semibold">Marque:</span> {car.marque}</p>
            <p><span className="font-semibold">Modèle:</span> {car.model}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Responsables</h3>
            <p>
              <span className="font-semibold">Propriétaire:</span> 
              {car.owner ? (
                <Link to={`/owners/${car.owner.id}`} className="ml-2 text-blue-600 hover:text-blue-900">
                  {car.owner.firstname} {car.owner.lastname}
                </Link>
              ) : 'Non assigné'}
            </p>
            <p>
              <span className="font-semibold">Conducteur:</span> 
              {car.driver ? (
                <Link to={`/drivers/${car.driver.id}`} className="ml-2 text-blue-600 hover:text-blue-900">
                  {car.driver.firstname} {car.driver.lastname}
                </Link>
              ) : 'Non assigné'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Historique des trajets</h3>
      {routes.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de départ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map(route => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(route.start_date).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(route.end_date).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{route.distance_traveled} km</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{route.travel_cost} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/routes/${route.id}`} className="text-blue-600 hover:text-blue-900">Détails</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="bg-white p-6 rounded-lg shadow text-gray-500">Aucun trajet enregistré pour ce véhicule.</p>
      )}
    </div>
  );
}

// Liste des trajets
function RoutesList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/routes');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        setRoutes(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, []);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Liste des trajets</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter un trajet
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map(route => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {route.car ? `${route.car.marque} ${route.car.model} (${route.car.registration})` : 'Inconnu'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(route.start_date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {calculateDuration(route.start_date, route.end_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{route.distance_traveled} km</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{route.travel_cost} €</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/routes/${route.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Détails</Link>
                  <button className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fonction utilitaire pour calculer la durée entre deux dates
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}min`;
}

// Détail d'un trajet
function RouteDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails du trajet
        const routeRes = await fetch(`http://localhost:3000/api/routes/${id}`);
        if (!routeRes.ok) throw new Error('Erreur lors du chargement des données du trajet');
        const routeData = await routeRes.json();
        setRoute(routeData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRouteData();
  }, [id]);
  
  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;
  if (!route) return <div className="text-center py-8">Trajet non trouvé</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Détails du trajet</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations du trajet</h3>
            <p><span className="font-semibold">Date de départ:</span> {new Date(route.start_date).toLocaleString()}</p>
            <p><span className="font-semibold">Date d'arrivée:</span> {new Date(route.end_date).toLocaleString()}</p>
            <p><span className="font-semibold">Durée:</span> {calculateDuration(route.start_date, route.end_date)}</p>
            <p><span className="font-semibold">Distance:</span> {route.distance_traveled} km</p>
            <p><span className="font-semibold">Coût:</span> {route.travel_cost} €</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Véhicule</h3>
            {route.car ? (
              <>
                <p>
                  <span className="font-semibold">Véhicule:</span> 
                  <Link to={`/cars/${route.car.id}`} className="ml-2 text-blue-600 hover:text-blue-900">
                    {route.car.marque} {route.car.model} ({route.car.registration})
                  </Link>
                </p>
                <p>
                  <span className="font-semibold">Conducteur:</span> 
                  {route.car.driver ? (
                    <Link to={`/drivers/${route.car.driver_id}`} className="ml-2 text-blue-600 hover:text-blue-900">
                      {route.car.driver.firstname} {route.car.driver.lastname}
                    </Link>
                  ) : 'Non assigné'}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Informations du véhicule non disponibles</p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Position</h3>
          {route.position ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p><span className="font-semibold">Horodatage:</span> {new Date(route.position.horodatage).toLocaleString()}</p>
                <p><span className="font-semibold">Latitude:</span> {route.position.latitude}</p>
                <p><span className="font-semibold">Longitude:</span> {route.position.longitude}</p>
                <p><span className="font-semibold">Vitesse:</span> {route.position.vitesse} km/h</p>
              </div>
              <div className="md:col-span-2 h-64 bg-gray-100 rounded-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Carte non disponible</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Informations de position non disponibles</p>
          )}
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// Composant de carte pour afficher les positions
function PositionMap({ mini = false }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/positions');
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        setPositions(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPositions();
  }, []);
  
  if (loading) return <div className={`text-center py-8 ${mini ? 'h-64' : 'h-96'} bg-white rounded-lg shadow`}>Chargement de la carte...</div>;
  if (error) return <div className={`text-center py-8 text-red-600 ${mini ? 'h-64' : 'h-96'} bg-white rounded-lg shadow`}>Erreur: {error}</div>;
  
  return (
    <div className={`${mini ? '' : 'mt-6'}`}>
      {!mini && <h2 className="text-2xl font-semibold mb-6">Carte des positions</h2>}
      
      <div className={`bg-white rounded-lg shadow p-4 ${mini ? 'h-64' : 'h-96'}`}>
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Implémentation de la carte à venir</p>
          <p className="text-gray-500 hidden">
            Points de données disponibles: {positions.length} positions
            {/* Ces données seraient utilisées pour afficher des marqueurs sur une carte réelle */}
          </p>
        </div>
      </div>
      
      {!mini && positions.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horodatage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vitesse</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map(position => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(position.horodatage).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{position.latitude}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{position.longitude}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{position.vitesse} km/h</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;