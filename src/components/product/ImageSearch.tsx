import { useState } from "react";
import { api } from "../../api/client";
import { Link } from "react-router-dom";

export function ImageSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    
    setLoading(true);
    setResults([]);
    
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const { data } = await api.post("/catalog/image-search/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(data.results);
    } catch (err) {
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Search Button to trigger modal */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
      >
        📷 Search by Image
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-900">AI Image Search</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {!results.length ? (
                <form onSubmit={handleSearch} className="space-y-4">
                  <label className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer block bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                        if (file) setPreview(URL.createObjectURL(file));
                      }} 
                    />
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-32 mx-auto object-contain rounded-lg" />
                    ) : (
                      <div className="text-gray-500">
                        <span className="text-4xl block mb-2">🖼️</span>
                        <p className="font-medium text-gray-700">Click to upload a photo</p>
                        <p className="text-sm mt-1">We'll find matching phones in our store.</p>
                      </div>
                    )}
                  </label>
                  <button 
                    type="submit" 
                    disabled={!imageFile || loading}
                    className="btn-primary w-full py-3 rounded-xl"
                  >
                    {loading ? "Searching..." : "Find Matching Phones"}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Visual Matches</h3>
                    <button onClick={() => { setResults([]); setPreview(null); setImageFile(null); }} className="text-sm text-blue-600 hover:underline">
                      Search another
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {results.map((phone) => (
                      <Link 
                        key={phone.id} 
                        to={`/phones/${phone.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="card p-3 hover:shadow-md transition group"
                      >
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                          {phone.image && <img src={phone.image} alt={phone.name} className="w-full h-full object-cover group-hover:scale-105 transition" />}
                        </div>
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{phone.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}