// Painel de filtros — vai dentro do <Drawer>.
// Tem: input de ingredientes (com chips removíveis), checkboxes de dieta e intolerâncias,
// botões "Limpar" e "Aplicar".

import styled from '@emotion/styled';
import { useState, type FormEvent } from 'react';
import { useReceitas } from '../ReceitasContext';
import { DIETAS, INTOLERANCIAS, CUISINES, MEAL_TYPES } from '../types';
import Button from './Button';

interface Props {
  onAplicar: () => void;
}

export default function FiltrosPanel({ onAplicar }: Props) {
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

  return (
    <Container>
      {/* --- Ingredientes --- */}
      <Secao>
        <Legenda>Ingredientes</Legenda>
        <FormIngrediente onSubmit={adicionarIngrediente}>
          <Input
            type="text"
            placeholder="ex: tomate, frango..."
            value={novoIngrediente}
            onChange={(e) => setNovoIngrediente(e.target.value)}
            aria-label="Adicionar ingrediente"
          />
          <BotaoAdd type="submit" aria-label="Adicionar">+</BotaoAdd>
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
                  aria-label={`Remover ${ing}`}
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
        <Legenda>Dieta</Legenda>
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
        <Legenda>Intolerâncias</Legenda>
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
          Cozinha
          <Hint>(escolha apenas uma)</Hint>
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
          Tipo de refeição
          <Hint>(escolha apenas um)</Hint>
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

      {/* --- Ações --- */}
      <Acoes>
        <Button
          variante="fantasma"
          type="button"
          onClick={() => dispatch({ type: 'FILTROS_LIMPOS' })}
        >
          Limpar
        </Button>
        <Button variante="primario" type="button" onClick={onAplicar}>
          Aplicar
        </Button>
      </Acoes>
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

const Acoes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espacos.sm};
  padding-top: ${({ theme }) => theme.espacos.lg};
  border-top: 1px solid ${({ theme }) => theme.cores.borda};

  button {
    flex: 1;
  }
`;
