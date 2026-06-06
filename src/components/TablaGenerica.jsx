import React from "react";

function TablaGenerica({ columnas, datos, renderFila, paginacion }) {
  const { page, setPage, pages, total } = paginacion;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <table className="table table-striped table-hover mb-0">
          <thead>
            <tr>
              {columnas.map((col, index) => (
                <th
                  key={index}
                  className={col.alineacion || "text-start"}
                  style={{ width: col.ancho }}
                >
                  {col.texto}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {datos && datos.length > 0 ? (
              datos.map((item, index) => (
                <tr key={item.id || index}>
                  {renderFila(item)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnas.length} className="text-center text-muted py-3">
                  No hay datos disponibles para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación Genérica Mejorada*/}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/*Izquierda: Informacion de registros */}
          <span className="text-muted small">
            Total de registros: <strong>{total || 0}</strong>
          </span>
          {/*Centro: Indicador de paginas*/}
          <span className="align-self-center fw-medium">
            Página {page} de {pages || 1}
          </span>
          {/*Derecha: Botones de navegación*/}
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <=1} // Deshabilita si esta es la primera página
            >
              Anterior
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= pages} // Deshabilita si esta es la ultima página
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TablaGenerica;