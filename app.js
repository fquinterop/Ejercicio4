// Recipe Box - Ejemplo4
// Configura tu endpoint MockAPI para 'recipes'
// Ej: https://<tu-subdominio>.mockapi.io/api/v1/recipes
const MOCKAPI_RECIPES_URL = 'https://68f1512ab36f9750dee9068f.mockapi.io/Tarta_Manzana';

let recipes = [];

const $recipes = document.getElementById('recipes');
const $tpl = document.getElementById('recipeTpl');
const form = document.getElementById('recipeForm');

async function loadRecipes() {
  if (!MOCKAPI_RECIPES_URL || MOCKAPI_RECIPES_URL.trim() === '') {
    $recipes.innerHTML = '<div class="p-4 bg-yellow-50 rounded">Configura MOCKAPI_RECIPES_URL en app.js</div>';
    return;
  }
  try {
    const res = await fetch(MOCKAPI_RECIPES_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    recipes = Array.isArray(data) ? data.map(d => ({ id: Number(d.id), title: d.title, img: d.img, ingredients: d.ingredients || [], steps: d.steps || '', fav: !!d.fav })) : [];
    renderRecipes();
  } catch (err) {
    $recipes.innerHTML = `<div class="p-4 bg-red-50 text-red-800 rounded">Error cargando recetas: ${err.message}</div>`;
  }
}

function renderRecipes(filter = '') {
  $recipes.innerHTML = '';
  const list = recipes.filter(r => r.title.toLowerCase().includes(filter.toLowerCase()));
  if (list.length === 0) {
    $recipes.innerHTML = '<div class="p-4 bg-yellow-50 rounded">No se encontraron recetas.</div>';
    return;
  }
  for (const r of list) {
    const node = $tpl.content.cloneNode(true);
    const img = node.querySelector('img');
    const title = node.querySelector('.recipe-title');
    const count = node.querySelector('.recipe-count');
    const favBtn = node.querySelector('.favBtn');
    const editBtn = node.querySelector('.editBtn');
    const deleteBtn = node.querySelector('.deleteBtn');

    img.src = r.img || 'https://via.placeholder.com/400x300?text=No+Image';
    img.alt = r.title;
    title.textContent = r.title;
    count.textContent = `Ingredientes: ${Array.isArray(r.ingredients) ? r.ingredients.length : 0}`;
    favBtn.textContent = r.fav ? '★' : '☆';
    favBtn.addEventListener('click', async () => { await toggleFav(r.id, !r.fav); });
    editBtn.addEventListener('click', () => startEdit(r));
    deleteBtn.addEventListener('click', () => handleDelete(r.id));

    $recipes.appendChild(node);
  }
}

async function createRecipe(payload) {
  const res = await fetch(MOCKAPI_RECIPES_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Error creando: ${res.status}`);
  return await res.json();
}

async function updateRecipe(id, payload) {
  const res = await fetch(`${MOCKAPI_RECIPES_URL}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Error actualizando: ${res.status}`);
  return await res.json();
}

async function deleteRecipe(id) {
  const res = await fetch(`${MOCKAPI_RECIPES_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Error borrando: ${res.status}`);
  return true;
}

async function toggleFav(id, fav) {
  try {
    await updateRecipe(id, { fav });
    await loadRecipes();
  } catch (err) {
    alert('Error actualizando favorito: ' + err.message);
  }
}

function startEdit(r) {
  document.getElementById('rId').value = r.id;
  document.getElementById('rTitle').value = r.title || '';
  document.getElementById('rImg').value = r.img || '';
  document.getElementById('rIngredients').value = Array.isArray(r.ingredients) ? r.ingredients.join('\n') : '';
  document.getElementById('rSteps').value = r.steps || '';
  document.getElementById('rFav').checked = !!r.fav;
  document.getElementById('formTitle').textContent = 'Editar receta';
  document.getElementById('submitBtn').textContent = 'Guardar';
  document.getElementById('cancelBtn').classList.remove('hidden');
}

function resetForm() {
  form.reset();
  document.getElementById('rId').value = '';
  document.getElementById('formTitle').textContent = 'Nueva receta';
  document.getElementById('submitBtn').textContent = 'Guardar';
  document.getElementById('cancelBtn').classList.add('hidden');
}

async function handleDelete(id) {
  if (!confirm('¿Borrar esta receta?')) return;
  try {
    await deleteRecipe(id);
    await loadRecipes();
  } catch (err) {
    alert('Error borrando receta: ' + err.message);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('rId').value;
  const payload = {
    title: document.getElementById('rTitle').value.trim(),
    img: document.getElementById('rImg').value.trim(),
    ingredients: document.getElementById('rIngredients').value.split('\n').map(s => s.trim()).filter(Boolean),
    steps: document.getElementById('rSteps').value.trim(),
    fav: document.getElementById('rFav').checked,
  };
  try {
    if (!MOCKAPI_RECIPES_URL || MOCKAPI_RECIPES_URL.trim() === '') throw new Error('MOCKAPI_RECIPES_URL no configurada');
    if (id && id.trim() !== '') {
      await updateRecipe(id, payload);
    } else {
      await createRecipe(payload);
    }
    resetForm();
    await loadRecipes();
  } catch (err) {
    document.getElementById('formMsg').textContent = 'Error: ' + err.message;
    setTimeout(() => { document.getElementById('formMsg').textContent = ''; }, 3000);
  }

document.getElementById('cancelBtn').addEventListener('click', resetForm);
document.getElementById('search').addEventListener('input', (e) => renderRecipes(e.target.value));

loadRecipes();


});
