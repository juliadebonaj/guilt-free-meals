// Painel de filtros — vai dentro do <Drawer>.
// Tem: input de ingredientes (com chips removíveis), checkboxes de dieta e intolerâncias,
// e um botão "Limpar". Cada toggle dispara busca automaticamente via efeito em Search.tsx.

import styled from '@emotion/styled';
import { useState, type FormEvent } from 'react';
import { useReceitas } from '../ReceitasContext';
import { DIETAS, INTOLERANCIAS, CUISINES, MEAL_TYPES } from '../types';

export default function FiltrosPanel() {
  const { state, dispatch } = useReceitas();
  const { filtros } = state;
  const [novoIngrediente, setNovoIngrediente] = useState('');

  const adicionarIngrediente = (e: FormEvent) => {
    e.preventDefault();
    const valor = novoIngrediente.trim();
    if (!valor) return;
    dispatch({ type: 'INGREDIENTE_ADICIONADO', payload: valor });
    setNovoIngrediente('');
  };

  const totalAtivos =
    filtros.ingredientes.length +
    filtros.dietas.length +
    filtros.intolerancias.length +
    filtros.cuisines.length +
    filtros.mealTypes.length;

  // Lista de rótulos (em português) de todos os filtros ativos.
  // Ingredientes são strings livres digitadas pelo usuário, os outros têm rótulos
  // pré-definidos nas constantes em types.ts.
  const rotulosAtivos: string[] = [
    ...filtros.ingredientes,
    ...filtros.dietas.map(
      (v) => DIETAS.find((d) => d.valor === v)?.rotulo ?? v
    ),
    ...filtros.intolerancias.map(
      (v) => INTOLERANCIAS.find((i) => i.valor === v)?.rotulo ?? v
    ),
    ...filtros.cuisines.map(
      (v) => CUISINES.find((c) => c.valor === v)?.rotulo ?? v
    ),
    ...filtros.mealTypes.map(
      (v) => MEAL_TYPES.find((m) => m.valor === v)?.rotulo ?? v
    ),
  ];

  const resumoFiltros =
    rotulosAtivos.length === 0
      ? 'No active filters'
      : rotulosAtivos.length <= 2
      ? rotulosAtivos.join(', ')
      : `${rotulosAtivos.slice(0, 2).join(', ')}, ...`;

  return (
    <Container>
      {/* --- Topo: contagem + limpar --- */}
      <Topo>
        <TopoTexto>
          <Contagem>{resumoFiltros}</Contagem>
          {totalAtivos > 0 && (
            <ContagemNum>
              {totalAtivos === 1 ? '1 active filter' : `${totalAtivos} active filters`}
            </ContagemNum>
          )}
        </TopoTexto>
        <LimparBtn
          type="button"
          onClick={() => dispatch({ type: 'FILTROS_LIMPOS' })}
          disabled={totalAtivos === 0}
        >
          Clear all
        </LimparBtn>
      </Topo>

      {/* --- Ingredientes --- */}
      <Secao>
        <Legenda>Ingredients</Legenda>
        <FormIngrediente onSubmit={adicionarIngrediente}>
          <Input
            type="text"
            placeholder="e.g. tomato, chicken..."
            value={novoIngrediente}
            onChange={(e) => setNovoIngrediente(e.target.value)}
          />
          <BotaoAdd type="submit">+</BotaoAdd>
        </FormIngrediente>

        {filtros.ingredientes.length > 0 && (
          <ListaChips>
            {filtros.ingredientes.map((ing) => (
              <Chip key={ing}>
                <span>{ing}</span>
                <RemoverBtn
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'INGREDIENTE_REMOVIDO', payload: ing })
                  }
                >
                  ×
                </RemoverBtn>
              </Chip>
            ))}
          </ListaChips>
        )}
      </Secao>

      {/* --- Dietas (chips múltiplos) --- */}
      <Secao>
        <Legenda>Diet</Legenda>
        <ChipsGrid>
          {DIETAS.map((d) => (
            <ChipToggle
              key={d.valor}
              type="button"
              ativo={filtros.dietas.includes(d.valor)}
              onClick={() =>
                dispatch({ type: 'DIETA_ALTERNADA', payload: d.valor })
              }
            >
              {d.rotulo}
            </ChipToggle>
          ))}
        </ChipsGrid>
      </Secao>

      {/* --- Intolerâncias (chips múltiplos) --- */}
      <Secao>
        <Legenda>Intolerances</Legenda>
        <ChipsGrid>
          {INTOLERANCIAS.map((i) => (
            <ChipToggle
              key={i.valor}
              type="button"
              ativo={filtros.intolerancias.includes(i.valor)}
              onClick={() =>
                dispatch({ type: 'INTOLERANCIA_ALTERNADA', payload: i.valor })
              }
            >
              {i.rotulo}
            </ChipToggle>
          ))}
        </ChipsGrid>
      </Secao>

      {/* --- Cuisine (radio) --- */}
      <Secao>
        <Legenda>
          Cuisine
          <Hint>(choose only one)</Hint>
        </Legenda>
        <ChipsGrid>
          {CUISINES.map((c) => (
            <ChipToggle
              key={c.valor}
              type="button"
              ativo={filtros.cuisines.includes(c.valor)}
              onClick={() =>
                dispatch({ type: 'CUISINE_ALTERNADA', payload: c.valor })
              }
            >
              {c.rotulo}
            </ChipToggle>
          ))}
        </ChipsGrid>
      </Secao>

      {/* --- Meal type (radio) --- */}
      <Secao>
        <Legenda>
          Meal type
          <Hint>(choose only one)</Hint>
        </Legenda>
        <ChipsGrid>
          {MEAL_TYPES.map((m) => (
            <ChipToggle
              key={m.valor}
              type="button"
              ativo={filtros.mealTypes.includes(m.valor)}
              onClick={() =>
                dispatch({ type: 'MEAL_TYPE_ALTERNADO', payload: m.valor })
              }
            >
              {m.rotulo}
            </ChipToggle>
          ))}
        </ChipsGrid>
      </Secao>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.xl};
`;

const Secao = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espacos.sm};
`;

const Legenda = styled.h3`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: ${({ theme }) => theme.cores.sage[900]};
  font-weight: ${({ theme }) => theme.pesoFonte.semibold};
  margin-bottom: ${({ theme }) => theme.espacos.xs};
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.espacos.sm};
`;

const Hint = styled.span`
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  text-transform: none;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.cores.texto.muted};
  font-weight: ${({ theme }) => theme.pesoFonte.regular};
  font-style: italic;
`;

const ChipsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espacos.xs};
`;

const ChipToggle = styled.button<{ ativo: boolean }>`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  padding: ${({ theme }) => theme.espacos.xs} ${({ theme }) => theme.espacos.md};
  border-radius: ${({ theme }) => theme.bordas.pill};
  border: 1px solid
    ${({ ativo, theme }) =>
      ativo ? theme.cores.sage[900] : theme.cores.borda};
  background: ${({ ativo, theme }) =>
    ativo ? theme.cores.sage[900] : 'transparent'};
  color: ${({ ativo, theme }) =>
    ativo ? theme.cores.branco : theme.cores.texto.secundario};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.cores.sage[900]};
    color: ${({ ativo, theme }) =>
      ativo ? theme.cores.branco : theme.cores.sage[900]};
  }
`;

const FormIngrediente = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.espacos.sm};
`;

const Input = styled.input`
  flex: 1;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.md};
  padding: ${({ theme }) => theme.espacos.sm} ${({ theme }) => theme.espacos.md};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: ${({ theme }) => theme.bordas.md};
  background: ${({ theme }) => theme.cores.cream[100]};
  color: ${({ theme }) => theme.cores.texto.primario};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.cores.sage[900]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.cores.texto.muted};
  }
`;

const BotaoAdd = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.bordas.md};
  border: 1px solid ${({ theme }) => theme.cores.sage[900]};
  background: ${({ theme }) => theme.cores.sage[900]};
  color: ${({ theme }) => theme.cores.branco};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.cores.texto.secundario};
  }
`;

const ListaChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espacos.xs};
  margin-top: ${({ theme }) => theme.espacos.xs};
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos.xs};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  background: ${({ theme }) => theme.cores.sage[300]};
  color: ${({ theme }) => theme.cores.texto.primario};
  padding: ${({ theme }) => theme.espacos.xs} ${({ theme }) => theme.espacos.sm};
  border-radius: ${({ theme }) => theme.bordas.pill};
`;

const RemoverBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.cores.texto.secundario};
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;

  &:hover {
    color: ${({ theme }) => theme.cores.estados.erro};
  }
`;

const Topo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacos.md};
  padding-bottom: ${({ theme }) => theme.espacos.md};
  border-bottom: 1px solid ${({ theme }) => theme.cores.borda};
`;

const TopoTexto = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const Contagem = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.texto.primario};
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContagemNum = styled.span`
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.xs};
  color: ${({ theme }) => theme.cores.texto.muted};
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const LimparBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font-family: ${({ theme }) => theme.fontes.corpo};
  font-size: ${({ theme }) => theme.tamanhosFonte.sm};
  color: ${({ theme }) => theme.cores.sage[900]};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.cores.estados.erro};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
