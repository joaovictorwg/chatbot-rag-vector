import styled from 'styled-components';

export const Header = styled.header`
  height: 68px;
  background-color: #ffffffff;
  border-bottom: 1px solid #e9ecef;
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  align-items: center;
  display: flex;
`;

export const Inner = styled.div`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const LinkStyled = styled.a<{ $active?: boolean }>`
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  background-color: ${({ $active }) => ($active ? '#ff9800' : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#ff9800' : '#e9ecef')};
    color: ${({ $active }) => ($active ? '#fff' : '#ff9800')};
  }
`;

export const Burger = styled.div`
  width: 24px;
  height: 2px;
  background-color: #333;
  position: relative;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 24px;
    background-color: #333;
    left: 0;
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
  }
`;
