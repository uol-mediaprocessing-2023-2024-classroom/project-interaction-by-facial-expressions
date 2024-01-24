import threading


class Debouncer:
    def __init__(self, limit, start_in_a_thread=False):
        self.limit = limit
        self.counter = 0
        self.last_value = None
        self.start_in_a_thread = start_in_a_thread

    def __call__(self, fn, value='', *args, **kwargs):
        if value == self.last_value:
            self.counter += 1
        else:
            self.counter = 1
            self.last_value = value

        if self.counter >= self.limit:
            self.counter = 0

            if self.start_in_a_thread:
                threading.Thread(target=fn, args=args, kwargs=kwargs).start()
            else:
                fn(*args, **kwargs)
