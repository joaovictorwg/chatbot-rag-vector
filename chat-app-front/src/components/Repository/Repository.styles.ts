import styled from 'styled-components';

export const Container = styled.div`
  padding: 16px;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Label = styled.label`
  font-size: 14px;
`;

export const FileInput = styled.input`
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007bff')};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const Alert = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  color: white;
  padding: 10px;
  border-radius: 4px;
  position: relative;
  margin-top: 10px;
`;

export const AlertClose = styled.span`
  position: absolute;
  top: 6px;
  right: 10px;
  cursor: pointer;
  font-weight: bold;
`;

export const Text = styled.p`
  font-size: 14px;
  margin: 4px 0;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

export const ListTitle = styled.li`
  font-weight: bold;
  margin-bottom: 8px;
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #ddd;
`;

export const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;
