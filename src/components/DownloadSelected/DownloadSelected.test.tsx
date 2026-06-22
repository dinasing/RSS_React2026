import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Providers } from '../../app/providers';
import DownloadSelected from './DownloadSelected.component';
import { mockBook } from '../../test-utils/fixtures';

const downloadSelectedCsvActionMock = vi.fn();

vi.mock('../../actions/downloadSelectedCsv.action', () => ({
  downloadSelectedCsvAction: (_prevState: unknown, selectedItems: unknown) =>
    downloadSelectedCsvActionMock(_prevState, selectedItems),
}));

describe('DownloadSelected', () => {
  beforeEach(() => {
    downloadSelectedCsvActionMock.mockReset();
    downloadSelectedCsvActionMock.mockResolvedValue({
      csv: 'name,description,detailsUrl\nBook,Jane Author (2001),https://openlibrary.org/works/OL1W',
      fileName: '1_items.csv',
    });
  });

  it('requests a server-generated csv and triggers a download', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:csv');
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    render(
      <Providers>
        <DownloadSelected selectedItems={[mockBook]} />
      </Providers>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(downloadSelectedCsvActionMock).toHaveBeenCalledWith(null, [
        mockBook,
      ]);
    });

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:csv');
    });

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
    click.mockRestore();
  });
});
