import React from "react";

function TablaGenerica({ columnas, datos, renderFila, paginacion }) {
  const { page, setPage, size } = paginacion;

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
            {datos.length > 0 ? (
              datos.map((item, index) => (
                <tr key={item.id || index}>
                  {/* Aquí delegamos el renderizado de los <td> a la vista padre */}
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

        {/* Paginación Genérica */}
        <div className="d-flex justify-content-between mt-3">
          {page > 1 ? (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((prev) => prev - 1)}
            >
              Anterior
            </button>
          ) : (
            <div />
          )}

          <span className="align-self-center fw-medium">
            Página {page}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={datos.length < size}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablaGenerica;