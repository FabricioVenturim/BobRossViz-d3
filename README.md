# Projeto de Visualização de Dados

Este projeto envolve a criação de visualizações usando D3 com base em dados resultantes de redução de dimensionalidade e agrupamento aplicados a descrições de pinturas de Bob Ross. Cada entrada no conjunto de dados representa uma pintura individual, com atributos binários (0 ou 1) indicando a presença de características específicas do terreno, naturais ou feitas pelo homem. Esses atributos são extraídos das descrições de pinturas de Bob Ross e são visualmente explorados por meio de técnicas como Análise de Componentes Principais (PCA) e k-means.

[Gravação de tela de 21-12-2023 14:06:52.webm](https://github.com/FabricioVenturim/BobRossViz-d3/assets/86852019/23bda1cd-890d-4674-83cc-3c50b2da2e0a)

## Inclusão de Visualizações:

1. **PCA Scatter Plot:**
   - Mostra a projeção 2D dos dados após o PCA.
   - O eixo X representa o primeiro componente principal, e o eixo Y representa o segundo componente principal.

2. **Divergent Bar Plot para PCA Loadings:**
   - Exibe dois gráficos de barras para cada atributo, um para cada componente principal, mostrando os carregamentos.
   - Gráficos de barras divergentes indicam a direção (positiva/negativa) do carregamento.

3. **Heatmap de Agrupamento:**
   - Visualiza os resultados do k-means com rótulos de atributos no eixo Y, nomes de características do terreno no eixo X e cores representando a soma dos valores do atributo para uma determinada combinação de rótulo e atributo.

## Configuração do Ambiente

### Requisitos

Certifique-se de ter o Python instalado, pois será necessário para gerar os dados. O Conda não é necessário, mas é recomendado ter instalado em seu sistema.

- [Python](https://www.python.org/downloads/)
- [Conda](https://docs.conda.io/en/latest/miniconda.html)

### Configurando o Ambiente

#### Clone o repositório

```bash
git clone https://github.com/FabricioVenturim/BobRossViz-d3.git
cd BobRossViz-d3
```


### Crie um ambiente virtual usando Conda (Opcional)

Apenas necessário para organizar as bibliotecas a serem instaladas, caso não queira, pula para a instalação utilizando pip.

```bash
conda env create -f environment.yml
conda activate PCA
```

### Instalação de Dependências Python (opcional)
Se preferir usar um ambiente virtual baseado em `pip`, você pode instalar as dependências Python listadas no arquivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

## Uso:

Com o ambiente configurado, basta rodar o arquivo server.py:

```bash
cd back-end/
python server.py
```
Não finalize o terminal até ter certeza que não irá mais usar o gráfico, pois ele precisa ficar conectado para gerar os dados.

### Acessar o Site

Você pode rodar o arquivo `index.html`, mas pode simplemente acessar o [site](https://fabricioventurim.github.io/BobRossViz-d3/).



